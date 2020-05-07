'use strict'

class grapher {
	constructor() {
		
		this.handler = null // ассоциированный элемент канвас
		this.context = null // графический контекст
		// стиль линии
		this.lineStyle = {
			width: 1,
			color: '#e21a1a'
		}
		// стиль маркера
		this.markerStyle = {
			radius: 3,
			color: '#e21a1a',
			frequency: 2,
		}
		// стиль координатных осей
		this.axisStyle = {
			width: 1,
			color: '#4e4e4'
		}
		// стиль подписей к значениям координат
		this.numberStyle = {
			N: 10,			// количество меток на оси
			fontSize: 14,
			fontFamily: 'Courier',
			color: '4e4e4e',
			dX: 10, // сдвиг подписи вправо от оси для OY
			dY: 15 // свдиг подписи вверх от оси для OX
		}
		// стиль риски на оси координат
		this.tickStyle = {
			width: 1,
			size: 10,
			color: '#4e4e4e'
		}
		// количество элементарных линий между двумя точками графика
		this.scaleX = 1
		this.scaleY = 1
		this.dX = 0
		this.dY = 0
		this.graphMargin = 1
	}
// связать отрисовку графики с канвой	
	init( canvas ) {
		this.handler = canvas
		this.context = canvas.getContext('2d')
		
		return this
	}
// изменить цвет линии графика
	setLineColor(color)
	{
		this.lineStyle.color = color
		return this
	}
// изменить цвет осей
	setAxisColor(color)
	{
		this.axisStyle.color = color
		return this
	}
// настроить масштаб отрисовки к границам области
	adjust (xMin, xMax, yMin, yMax) {
		this.scaleX = this.handler.width / (xMax - xMin)
		this.scaleY = -this.handler.height / (yMax - yMin)
		this.dX = -xMin * this.scaleX
		this.dY = this.handler.height - yMin * this.scaleY
		
		return this
	}
// масштабирование по продольной оси
	transformX(x) {
		return x * this.scaleX + this.dX
	}	
// масштабирование по поперечной оси 
	transformY(y) {
		return y * this.scaleY + this.dY
	}	
// изобразить координатные оси
	drawAxis(xMin, xMax, yMin, yMax) {
		const X0 = this.transformX(0)
		const Y0 = this.transformY(0)
		
		const X_MIN = this.transformX(xMin)
		const Y_MIN = this.transformY(yMin)
				
		const X_MAX = this.transformX(xMax)
		const Y_MAX = this.transformY(yMax)
		
		const dX = (X_MAX - X_MIN) / this.numberStyle.N
		const dY = (Y_MAX - Y_MIN) / this.numberStyle.N
		
		const _dX = (xMax - xMin) / this.numberStyle.N
		const _dY = (yMax - yMin) / this.numberStyle.N
		
		this.context.font = `${this.numberStyle.fontSize}px ${this.numberStyle.fontFamily}`
		this.context.fillStyle = this.numberStyle.color
		
		// координаты, приведенные к экранным
		let X = X_MIN 
		let Y = Y_MIN
		// реальные значения координат
		let _x = xMin
		let _y = yMin
		
		const tickOffset = this.tickStyle.size / 2
		
		for(let i = 0; i < this.numberStyle.N; i++) {
			this.context.fillText(_y.toFixed(3), X0 + this.numberStyle.dX, Y )
			this.context.fillText(_x.toFixed(3), X, Y0 + this.numberStyle.dY )
			
			this.context.strokeStyle = this.tickStyle.color
			this.context.lineWidth = this.tickStyle.width
			this.context.moveTo(X0 - tickOffset, Y)
			this.context.lineTo(X0 + tickOffset, Y)
			this.context.stroke()
			this.context.moveTo(X, Y0 - tickOffset)
			this.context.lineTo(X, Y0 + tickOffset)
			this.context.stroke()
			
			X += dX
			Y += dY	
			_x += _dX
			_y += _dY			
		}
		
		this.context.strokeStyle = this.axisStyle.color
		this.context.lineWidth = this.axisStyle.width
		this.context.beginPath()
		
		this.context.lineTo(X_MIN, Y0)
		this.context.lineTo(X_MAX, Y0)
		this.context.stroke()
		
		this.context.beginPath()
		this.context.lineTo(X0, Y_MAX)
		this.context.lineTo(X0, Y_MIN)
		this.context.stroke()
	}
// отрисовать график по набору точек
	drawGraphic(xArr, yArr) {
		const xMin = -3.5
		const xMax = -0.75
		
		const yMin = -1.25
		const yMax = 1.25
		
		this
			.adjust(xMin, xMax, yMin, yMax)
			.drawAxis(xMin, xMax, yMin, yMax)
		
		const iMax = xArr.length
		
		this.context.strokeStyle = this.lineStyle.color
		this.context.lineWidth = this.lineStyle.width
				
		this.context.beginPath()
		
		let x0 = this.transformX(xArr[0])
		let y0 = this.transformY(yArr[0]) 
		let x1, y1
		
		for(let i = 1; i < iMax; i++) {
			x1 = this.transformX(xArr[i])
			y1 = this.transformY(yArr[i])
			this.context.moveTo(x0, y0)
			this.context.lineTo(x1, y1)
			x0 = x1
			y0 = y1
		}
		this.context.stroke()
		return this
	}
	
	drawPoints(xArr, yArr) {
		const xMin = -3.5
		const xMax = -0.75
		
		const yMin = -1.25
		const yMax = 1.25
		
		this
			.adjust(xMin, xMax, yMin, yMax)
			.drawAxis(xMin, xMax, yMin, yMax)
		
		const iMax = xArr.length
		
		this.context.strokeStyle = this.lineStyle.color
		this.context.lineWidth = this.lineStyle.width
	
		for(let i = 0; i < iMax; i++) {
				const x = this.transformX(xArr[i])
				const y = this.transformY(yArr[i])
				this.context.beginPath()
				this.context.arc(
					x,
					y,
					5,
					0,
					6.28					
				)
				this.context.stroke()
		}
		return this		
	}	
}