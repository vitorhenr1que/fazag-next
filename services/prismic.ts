import * as prismic from '@prismicio/client' 

export const getClient = () => {
    const client = prismic.createClient('fazag', {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN
    })
    return client
}
