import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  let [posts,setPosts]= useState([])
  const [filter, setFilter] = useState("all") 

  const [showModal, setShowModal] = useState(false)
  const [editablePost, setEditablePost] = useState(null)

  useEffect(()=>{
    axios.get('http://localhost:8000/api/posts')
    .then(response=>{
        console.log(response.data)
        setPosts(response.data)
    })
    .catch(err=>{
        console.error('Error fetching posts: ',err.message);
    })
  },[])

  const handleUpdate = (updatedPost) => {
    axios.put(`http://localhost:8000/api/updatePost/${updatedPost.id}`, updatedPost)
      .then(res => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? res.data : p))
        setShowModal(false)
        setEditablePost(null)
      })
      .catch(err => {
        console.error("Өзгерту қатесі:", err.message)
      })
  }

  const handleDelete = (id) => {
    if (confirm("Постты өшіргіңіз келе ме?")) {
      axios.delete(`http://localhost:8000/api/deletePost/${id}`)
        .then(() => {
          setPosts(prev => prev.filter(p => p.id !== id))
        })
        .catch(err => {
          console.error("Өшіру кезінде қате:", err.message)
        })
    }
  }

  let signedUser = JSON.parse(localStorage.getItem('user'))

  const filteredPosts = filter === "all" ? posts : posts.filter(post => post.user_id === signedUser.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {showModal && editablePost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4">Постты өзгерту</h2>

            <input 
              type="text" 
              className="border px-3 py-2 mb-3 w-full rounded" 
              value={editablePost.title}
              onChange={(e) => setEditablePost({ ...editablePost, title: e.target.value })}
            />
            <textarea 
              className="border px-3 py-2 mb-3 w-full rounded" 
              rows="4"
              value={editablePost.content}
              onChange={(e) => setEditablePost({ ...editablePost, content: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Бас тарту
              </button>
              <button 
                onClick={() => handleUpdate(editablePost)} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Сақтау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Үстіңгі панель */}
      <div className="mb-12 text-center">
        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => setFilter("all")} 
            className={`px-4 py-2 border rounded-full ${filter === "all" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            Барлық посттар
          </button>
          <button 
            onClick={() => setFilter("my")} 
            className={`px-4 py-2 border rounded-full ${filter === "my" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            Менің посттарым
          </button>
        </div>
        <Link 
          to="/add-post"
          className="
            inline-block 
            border 
            border-gray-400 
            px-6 py-2 
            rounded-full 
            hover:bg-gray-100 
            transition-all
            text-sm
          "
        >
          Пост қосу +
        </Link>
      </div>

      {/* Posts list */}
      <div className="space-y-8">
        {filteredPosts.length === 0 ? (
          <p className="text-center py-12 text-gray-400">Посттар жоқ</p>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id}>
              <h2 className="text-lg font-medium mb-1">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.content}</p>
              
              {post.image && (
                <div className="my-3">
                  <img
                    src={`http://localhost:8000/uploads/${post.image}`}
                    alt="post content"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              
              <div className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              {filter === "my" && post.user_id === signedUser.id && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setEditablePost(post)
                      setShowModal(true)
                    }} 
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Өзгерту
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    className="text-red-500 text-sm hover:underline"
                  >
                    Өшіру
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        
      </div>
    </div>
  )
}