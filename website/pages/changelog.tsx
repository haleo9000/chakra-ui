import React from "react"
import { loadMdx } from "utils/load-mdx-dir"
import components from "components/mdx-components"
import { MDXRemote } from "next-mdx-remote"
import { InferGetStaticPropsType } from "next"

function Changelog({
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <MDXRemote {...mdxSource} components={components} />
}

export async function getStaticProps() {
  const changelogPath = [__dirname, "..", "..", "Changelog.md"].join("/")
  const page = await loadMdx(changelogPath)

  if (!page) {
    console.warn(`No changelog found`)
  }

  const { mdxSource, ...frontMatter } = page

  return {
    props: {
      mdxSource,
      frontMatter,
    },
  }
}

export default Changelog
