import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
// import store from '@/redux/store'

export default function Posts() {
  const {posts} = useSelector(store=>store.post);

  return (
    <>
    <div>
      {
        // posts.map((post) => <Post  key={post._id} post={post} /> )//
        posts.map((post)=> <Post key={post._id} post={post}/>)

      }
    </div>
    </>
    )
}
