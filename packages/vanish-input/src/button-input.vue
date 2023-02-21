<script setup lang="ts">
import { onMounted, ref } from 'vue'

/* 爆炸粒子效果 圆形 */
const ExplodingParticle = function (this: any) {
  // 粒子动画延迟
  this.animationDuration = 1000 // in ms

  // 粒子速度
  this.speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10,
  }

  // 粒子尺寸
  this.radius = 5 + Math.random() * 5

  // 粒子最大存在时间
  this.life = 30 + Math.random() * 10
  this.remainingLife = this.life

  // 绘制
  this.draw = (
    ctx: {
      beginPath: () => void
      arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number) => void
      fill: () => void
      fillStyle: string
    }) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const p = this

    if (this.remainingLife > 0
        && this.radius > 0) {
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

let particles: any[] = []
function createParticleAtPoint(x: any, y: any, colorData: any) {
  const particle = new (ExplodingParticle as any)()
  particle.rgbArray = colorData
  particle.startX = x
  particle.startY = y
  particle.startTime = Date.now()
  particles.push(particle)
}

const reductionFactor = 17
const handleBtnClick = (e: any) => {
  // 点击的那个位置创建一个粒子
  // Get our color data like before
  // const localX = e.offsetX
  // const localY = e.offsetY
  // const rgbaColorArr = [0, 0, 88, 255]
  // const bcr = e.target.getBoundingClientRect()
  // const globalX = bcr.left + localX
  // const globalY = bcr.top + localY
  // createParticleAtPoint(globalX, globalY, rgbaColorArr)

  // 点击的整个 Dom 创建粒子
  // 1.获取dom的尺寸
  const width = e.target.offsetWidth
  const height = e.target.offsetHeight
  // const colorData = (btnCtx as CanvasRenderingContext2D).getImageData(0, 0, width, height).data // 从点击处获取 Dom 颜色
  const colorData = [0, 0, 88, 255]

  // 总共迭代了多少次，创建了多少个粒子
  let count = 0
  // 2.每一个位置创造一个粒子
  for (let localX = 0; localX < width; localX++) {
    for (let localY = 0; localY < height; localY++) {
      if (count % reductionFactor === 0) {
        const index = (localY * width + localX) * 4
        const rgbaColorArr = colorData.slice(index, index + 4)
        const bcr = e.target.getBoundingClientRect()
        const globalX = bcr.left + localX
        const globalY = bcr.top + localY
        createParticleAtPoint(globalX, globalY, rgbaColorArr)
      }
      count++
    }
  }
}

const btnRef = ref<HTMLElement | null>(null)
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let particleCtx: CanvasRenderingContext2D | null
function createParticleCanvas() {
  if (!particleCanvas.value)
    return
  particleCtx = particleCanvas.value.getContext('2d')
  particleCanvas.value.width = window.innerWidth
  particleCanvas.value.height = window.innerHeight
}

onMounted(() => {
  // 1.创建canvas背景板
  createParticleCanvas()

  if (!btnRef.value)
    return

  update()
})
function update() {
  // 清除旧的画布
  if (typeof particleCtx !== 'undefined' && particleCtx)
    particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  // 绘制所有的粒子，在新位置
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw(particleCtx)

    // Simple way to clean up if the last particle is done animating
    // 如果是最后一个粒子，那么 拿 当期的时间 - 开始的时间 跟动画 duration 时间做比较
    // 置空所有的
    if (i === particles.length - 1) {
      const percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration

      if (percent > 1)
        particles = []
    }
  }

  // 动画渲染
  window.requestAnimationFrame(update)
}
</script>

<template>
  <div class="container">
    <button id="btn" ref="btnRef" @click="handleBtnClick">
      Button
    </button>
    <canvas id="particleCanvas" ref="particleCanvas" class="particleCanvas" />
  </div>
</template>

<style  scoped>
.container{
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
}

.particleCanvas{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  pointer-events: none;
}
button {
  min-width: 135px;
  max-width: 200px;
  min-height: 50px;
  border: 0;
  outline: 0;

  color: white;

  /* pink to orange */
  background: #ee0979;
  background: linear-gradient(to right, #ee0979, #ff6a00);

  vertical-align: top;
}

button {
  cursor: pointer;
}
</style>
