import { InferGetStaticPropsType } from "next"
import { MDXRemote } from "next-mdx-remote"
import loadMDXFromPages from "utils/load-mdx-dir"
import components from "components/mdx-components"
import Layout from "layouts"

const CONTENT_PATH = "docs"

export default function Page({
  mdxSource,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout frontMatter={frontMatter}>
      <div>
        <h1>{frontMatter.title}</h1>
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const pages = await loadMDXFromPages(CONTENT_PATH)
  const paths = pages.map(({ slug }) => ({
    params: { slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug
  const pages = await loadMDXFromPages(CONTENT_PATH, { removeSlugPart: false })
  const [page] = pages.filter(
    (page) => [CONTENT_PATH, slug.join("/")].join("/") === page.slug.join("/"),
  )

  if (!page) {
    throw new Error(`No content found for slug "${slug.join("/")}"`)
  }

  const { mdxSource, ...frontMatter } = page

  return {
    props: {
      mdxSource,
      frontMatter,
    },
  }
}
