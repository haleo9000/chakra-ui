import { createExcerpt, fileToPath } from "@docusaurus/utils"
import siteConfig from "configs/site-config"
import path from "path"
import shell from "shelljs"
import { calcReadTime } from "utils/calc-read-time"
import { processFrontmatter, serializeMdx } from "utils/mdx-utils"
import fs from "fs/promises"

export async function loadMdx(filename: string) {
  // get the `pages` directory
  const pagesDir = path.join(process.cwd(), "pages")

  // gets the relative mdx path
  // pages/docs/guides.mdx => /docs/guides.mdx
  const relativeFilePath = path.relative(pagesDir, filename)

  const filePath = path.resolve(filename)

  const mdxContent = (await fs.readFile(filePath)).toString()

  // extract frontmatter and content from markdown string
  const { source: mdxSource, frontMatter } = await serializeMdx(mdxContent)

  // extends frontmatter with more useful information
  return processFrontmatter({
    baseEditUrl: siteConfig.repo.editUrl,
    excerpt: frontMatter.excerpt || createExcerpt(mdxContent),
    readTimeMinutes: calcReadTime(mdxContent),
    ...frontMatter,
    path: relativeFilePath,
    mdxSource,
  })
}

async function loadMDXFromPages(
  mdxDir: string,
  { removeSlugPart = true } = {},
) {
  const dir = path.join(process.cwd(), `pages/${mdxDir}`)
  const filenames = shell.ls("-R", `${dir}/**/*.mdx`)

  const dataPromise = filenames.map(async (filename) => loadMdx(filename))

  const data = await Promise.all(dataPromise)

  return data.map(({ slug, ...rest }) => ({
    slug: slug.filter((s) => (removeSlugPart ? s !== mdxDir : true)),
    ...rest,
  }))
}

export default loadMDXFromPages
