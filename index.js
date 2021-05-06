const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'

		const drawMap = () => { 

			const vw = window.innerWidth
			const vh = window.innerHeight

			//find orientation and calculate height from map width
			const setMapHeight = (w, h, width) => {
				return w > h ? width / 2 : width * 1.5
			}

			const width = document.querySelector('.dataviz__map').clientWidth
			const height = setMapHeight(vw, vh, width)

			let svg = d3.select('.dataviz__map')
						.append('svg')
						.style('background-color', '#2F2F02')
						.attr('height', height)
						.attr('width', width)

			let colorScale = d3.scaleOrdinal()
								.range(["#cd4aa1",
"#69b842",
"#ac5dd1",
"#51bc7c",
"#616ddb",
"#c6ae3f",
"#85539e",
"#97ad5b",
"#da476d",
"#4ab29c",
"#c74b31",
"#48b1da",
"#d5822c",
"#6782c6",
"#497a38",
"#d58fcc",
"#896e2f",
"#a75069",
"#da8a6b"])


			let legend = d3.select('.dataviz__legend')
							.append('svg')
							.attr('height', height)
							.attr('id', 'legend')

			let legend_unit = height / 37 // 19 (categories) + 18 (equal space between) = 37

			/*fetch(url)
				.then(response => response.json())
				.then(data => console.log(data))*/

			d3.json(url)
				.catch(function(error){
					alert(error)
				})
				.then(function(data){
					console.log(data)

				let root = d3.hierarchy(data)
								.sum(d => d.value)
								.sort((a,b) => b.height - a.height || b.value - a.value )

				let treemap = d3.treemap()
								.size([width, height])
								.padding(1)

				treemap(root)

				let categories = root.leaves().map(node => node.data.category)
				categories = new Set (categories)
				
				colorScale.domain(categories)
				console.log(colorScale('Product Design'))

				svg.selectAll('rect')
					.data(root.leaves())
					.enter()
					.append('rect')
					.attr('x', d => d.x0)
					.attr('y', d => d.y0)
					.attr('width', d => d.x1 - d.x0)
					.attr('height', d => d.y1 -  d.y0)
					.attr('class', 'tile')
					.attr('data-value', d => d.data.value)
					.attr('data-name', d => d.data.name)
					.attr('data-category', d => d.data.category)
					.attr('fill', d => colorScale(d.data.category))

					//tooltip functions
					.on('mouseover', event =>{
						event.target.style.stroke = '#FDAC53'
						event.target.style.opacity = 0.8 
						d3.select('#tooltip')
							.style('opacity', 1)
							.style('background-color', `${event.target.getAttribute('fill')}`)
							.attr('data-value', event.target.getAttribute('data-value'))
							.html(
								event.target.getAttribute('data-name') +
								'<br>' + 'Category: ' + event.target.getAttribute('data-category') + 
								'<br>USD ' + event.target.getAttribute('data-value')
								)
						})


					.on('mousemove', event => {
						if (vw > vh) {
						d3.select('#tooltip')
							.style('left', event.pageX + 20 + 'px')
							.style('top', event.pageY - 90 + 'px')
						}
					})

					.on('mouseout', event =>{
						event.target.style.opacity = 1
						event.target.style.stroke = 'none' 
						d3.select('#tooltip')
							.style('opacity', 0)
					})

					legend.selectAll('g')
							.data(categories)
							.enter()
							.append('g')
							.append('text')
							.text(d => d)
							.style('transform', (d,i) => `translate(${legend_unit * 4.5}px, ${(legend_unit * i * 2) + legend_unit}px)`)

					legend.selectAll('g')
							.append('rect')
							.attr('class', 'legend-item')
							.attr('x', legend_unit)
							.attr('y', (d,i) => (legend_unit * i * 2) )
							.attr('height', legend_unit)
							.attr('width', legend_unit * 3)
							.attr('fill', d => colorScale(d))
					
				});

		};
			


		window.addEventListener('resize', () => {
			let nodes = document.getElementsByTagName('svg')
			let nodeArray = [...nodes]
			nodeArray.forEach(node => node.remove())
			drawMap()
		})
		