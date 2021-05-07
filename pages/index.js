import Head from 'next/head'

import Rooms from './Rooms';

export default function Home() {
  return (
    <div className="App">
      <Head>
        <title>Battleship APM</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Rooms />
    </div>
  )
}
