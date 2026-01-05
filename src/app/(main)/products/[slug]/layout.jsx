import React from 'react'

export async function generateMetadata({ params }) {
  const tempSlug = await params
  const slug = tempSlug.slug

  return {
    title: `${slug}`,
    description: `Details about: ${slug}`,
  };
}

const SingleProductLayout = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default SingleProductLayout
