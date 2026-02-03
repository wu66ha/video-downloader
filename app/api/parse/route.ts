import { NextRequest, NextResponse } from 'next/server'

// 配置多个解析API作为备选
const PARSE_APIS = [
  {
    name: '山海云端',
    url: 'https://api.yyy001.com/api/videoparse',
    method: 'GET',
    needToken: false,
  },
  {
    name: 'AlAPI',
    url: 'https://v1.alapi.cn/api/video/jh',
    method: 'GET',
    needToken: true,
    token: process.env.ALAPI_TOKEN || '',
  },
  {
    name: '呆错API',
    url: 'https://api.daicuo.cc/parse/',
    method: 'GET',
    needToken: true,
    token: process.env.DAICUO_TOKEN || '',
  },
]

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: '请提供视频链接' },
        { status: 400 }
      )
    }

    // 依次尝试各个API
    for (const api of PARSE_APIS) {
      try {
        let apiUrl = api.url
        const params = new URLSearchParams()

        if (api.method === 'GET') {
          if (api.needToken && api.token) {
            params.append('token', api.token)
          }
          params.append('url', url)
          apiUrl += `?${params.toString()}`
        }

        const response = await fetch(apiUrl, {
          method: api.method,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        // 检查是否成功
        if (data.code === 200 || data.success || data.data) {
          return NextResponse.json({
            success: true,
            source: api.name,
            title: data.title || data.data?.title || '',
            cover_url: data.cover_url || data.cover || data.data?.cover || '',
            video_url: data.video_url || data.url || data.data?.url || '',
            url_list: data.url_list || data.data?.url_list || [],
          })
        }
      } catch (err) {
        console.error(`${api.name} 解析失败:`, err)
        continue
      }
    }

    return NextResponse.json(
      { error: '解析失败，请检查链接是否正确或稍后重试' },
      { status: 500 }
    )
  } catch (error) {
    console.error('解析错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
