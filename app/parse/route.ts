import { NextRequest, NextResponse } from 'next/server'

// 使用可用的 API
const PARSE_API = 'https://api.yujn.cn/api/dy_jx.php'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: '请提供视频链接' },
        { status: 400 }
      )
    }

    // 调用 API
    const apiUrl = `${PARSE_API}?msg=${encodeURIComponent(url)}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    // 检查是否成功
    if (data.msg && data.msg.includes('解析成功')) {
      return NextResponse.json({
        success: true,
        source: '遇见API',
        title: data.title || data.name || '',
        cover_url: data.cover || data.images?.[0] || '',
        video_url: data.video || data.play_video || '',
        images: data.images || [],
        type: data.type || '视频',
      })
    } else {
      return NextResponse.json(
        { error: data.msg || '解析失败，请检查链接是否正确' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('解析错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
