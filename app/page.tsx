'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleParse = async () => {
    if (!url.trim()) {
      setError('请输入视频链接')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '解析失败')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || '解析失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleParse()
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#fff',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* 标题 */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '30px',
          color: '#202124',
          fontWeight: '400',
        }}>
          视频下载器
        </h1>

        {/* 搜索框 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="粘贴视频链接..."
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #dfe1e5',
              borderRadius: '24px',
              outline: 'none',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 1px 6px rgba(32,33,36,0.28)'
              e.target.style.borderColor = 'rgba(223,225,229,0)'
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none'
              e.target.style.borderColor = '#dfe1e5'
            }}
          />
          <button
            onClick={handleParse}
            disabled={loading}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              background: loading ? '#f8f9fa' : '#1a73e8',
              color: loading ? '#5f6368' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
            }}
          >
            {loading ? '解析中...' : '解析'}
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            padding: '12px',
            background: '#fce8e6',
            color: '#c5221f',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div style={{
            border: '1px solid #dfe1e5',
            borderRadius: '8px',
            padding: '20px',
            background: '#f8f9fa',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#202124' }}>
              {result.title || '视频信息'}
            </h3>

            {result.cover_url && (
              <img
                src={result.cover_url}
                alt="封面"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            )}

            {result.video_url && (
              <div>
                <a
                  href={result.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#1a73e8',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  下载视频
                </a>
              </div>
            )}

            {result.url_list && Array.isArray(result.url_list) && result.url_list.length > 0 && (
              <div>
                <p style={{ marginBottom: '10px', fontSize: '14px', color: '#5f6368' }}>
                  可选清晰度：
                </p>
                {result.url_list.map((item: any, index: number) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <a
                      href={item.url || item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#fff',
                        color: '#1a73e8',
                        border: '1px solid #1a73e8',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginRight: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      {item.ext || 'MP4'} {item.filesize ? `(${(item.filesize / 1024 / 1024).toFixed(1)}MB)` : ''}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 提示文字 */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#5f6368',
          marginTop: '30px',
        }}>
          支持抖音、快手、B站等主流视频平台
        </p>
      </div>
    </main>
  )
}
