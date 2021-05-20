import '../styles/globals.css'
import 'regenerator-runtime/runtime'
import React, {useEffect, useState} from 'react'

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}



function MyApp({ Component, pageProps, router }) {

  return <SafeHydrate>
            <Component {...pageProps} />
        </SafeHydrate>
}

export default MyApp