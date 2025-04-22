import Head from "next/head";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Verdana;
}
`

export default function App({ Component, pageProps }) {
  return(
    <>
      <Head>
        <title>Dapper Social</title>
        <meta name='description' content='Decentralized social media network'></meta>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
