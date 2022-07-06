import { render, screen } from "@testing-library/react";
import { getPrismicClient } from "../../services/prismic"
import Posts, { getStaticProps } from "../../pages/posts";

jest.mock('../../services/prismic')

const posts = [
    {
        slug: 'my-new-post',
        title: 'My New Post',
        excerpt: 'Post excerpt',
        updatedAt: 'March, 10'
    }
]

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My New Post'))
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockResolvedValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My new post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post excerpt' }
                            ],
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as never)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'mt-new-post',
                        title: 'My new post',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de abril de 2021'
                    }]
                }
            })
        )
    })
})