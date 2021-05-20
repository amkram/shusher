// Wrapper for AuspiceFrame that disables server-side rendering
import React from 'react'
import dynamic from 'next/dynamic'

const DynamicAuspiceFrame = dynamic(() => import('./AuspiceFrame'), {
    ssr: false
})

export default () => <DynamicAuspiceFrame />