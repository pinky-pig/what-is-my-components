export class TextParticleCircle {
  startX: number
  startY: number
  radius: number
  startTime: number
  life: number
  remainingLife: any
  speed: { x: number; y: number }
  rgbArray: number[]
  animationDuration: number
  constructor(x: number, y: number, rgba: number[], startTime = Date.now()) {
    this.animationDuration = 1000 // in ms
    this.startTime = startTime
    this.startX = x
    this.startY = y
    this.radius = 1 + Math.random() * 5
    this.life = 30 + Math.random() * 10
    this.remainingLife = this.life
    this.rgbArray = rgba
    this.speed = {
      x: -5 + Math.random() * 10,
      y: -5 + Math.random() * 10,
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const p = this

    if (this.remainingLife > 0 && this.radius > 0) {
      // 在当前的位置绘制粒子
      ctx.beginPath()
      ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${this.rgbArray[0]},${this.rgbArray[1]},${this.rgbArray[2]}, 1)`
      ctx.fill()

      // 更新粒子的运动
      p.remainingLife--
      p.radius -= 0.25
      p.startX += p.speed.x
      p.startY += p.speed.y
    }
  }
}
