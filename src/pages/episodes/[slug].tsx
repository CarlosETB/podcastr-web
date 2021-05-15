import format from 'date-fns/format'
import { ptBR } from 'date-fns/locale'
import parseISO from 'date-fns/parseISO'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import { api } from 'services/api'
import { convertDurationToTimeString } from 'utils/convertDurationToTimeString'
import { EpisodeProps } from 'utils/interfaces'
import Image from 'next/image'
import Link from 'next/link'

import styles from './styles.module.scss'
import { usePlayer } from 'contexts/PlayerContext'
import Head from 'next/head'

interface LayoutProps {
  episode: EpisodeProps;
}

const Episode: React.FC<LayoutProps> = (props) => {
  const { episode } = props

  const { play } = usePlayer()

  return (
    <div className={styles.episodePage}>
      <Head>
        <title>{episode.title} - Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>

        <Link href='/'>
          <button type='button' >
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit='cover'
        />
        <button type='button' onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export default Episode

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'publish_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    thumbnail: data.thumbnail,
    description: data.description,
    duration: Number(data.file.duration),
    url: data.file.url,
    durationAsString: convertDurationToTimeString(Number(data.file.duration))
  }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}