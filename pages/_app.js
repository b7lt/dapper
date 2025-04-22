import Head from "next/head";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  :root {
    --background: #000000;
    --foreground: #e7e9ea;
    --accent-blue: #1d9bf0;
    --accent-blue-hover: #1a8cd8;
    --border-color: rgba(255, 255, 255, 0.1);
    --secondary-text: #71767b;
    --search-background: #202327;
    --section-background: #16181c;
  }
  
  body {
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--background);
    color: var(--foreground);
    line-height: 1.3;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button, input, textarea {
    font-family: inherit;
  }
`;

export default function App({ Component, pageProps }) {
  return(
    <>
      <Head>
        <title>Dapper Social</title>
        <meta name='description' content='Decentralized social media network'></meta>
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}