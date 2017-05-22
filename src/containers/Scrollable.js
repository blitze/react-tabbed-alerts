import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, extendObservable } from 'mobx';

class Scrollable extends Component {
	list = {};
	wrapper = {};
	controlsWidth = 12;
	scrolling = false;

	constructor(props) {
		super(props);

		extendObservable(this, {
			viewport: 0,
			showNext: false,
			showPrev: false,
			leftPos: 0,

			get itemsWidth() {
				let itemsWidth = 0;
				let items = this.list.children;
		
				for (var i = 0, len = items.length; i < len; i++) {
					const element = items[i];
					itemsWidth += this.getWidth(element);
				}
		
				return itemsWidth;
			},
	
			toggleArrows: action(() => {
				this.showNext = (this.itemsWidth && (this.itemsWidth + this.leftPos) > this.viewport);
				this.showPrev = (this.leftPos < 0);
			}),
	
			scroll: action((direction) => {
				let operator = '';
				let leftInDirection = 0;
		
				if (direction === 'next') {
					operator = '-';
					leftInDirection = this.itemsWidth - this.viewport + this.leftPos + this.controlsWidth * 3;
				} else {
					operator = '+';
					leftInDirection = Math.abs(this.leftPos);
				}
		
				if (leftInDirection) {
					const distance = (leftInDirection > this.viewport) ? this.viewport : leftInDirection;
		
					this.scrolling = true;
					this.leftPos = this.posCalculator[operator](distance);
		
					setTimeout(() => {
						this.toggleArrows();
						this.scrolling = false;
					}, 1000);
				}
			})
		});
	}

	posCalculator = {
		'+': (distance) => this.leftPos + distance,
		'-': (distance) => this.leftPos - distance,
	};

	componentDidMount() {
		this.list = this.wrapper.firstChild;
		this.resize();
		window.addEventListener('resize', this.resize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}

	resize = () => {
		this.viewport = this.getWidth(this.wrapper);
		this.toggleArrows();
	}

	wrapperElement = (element) => this.wrapper = element;

	getWidth(element) {
		return element.getBoundingClientRect().width || element.offsetWidth;
	}

	handleClick = (direction) => (e) => {
		e.preventDefault();
		this.scroll(direction);
	}

	handleWheel = (e) => {
		e.preventDefault();
		const direction = (e.deltaY < 0) ? 'Prev' : 'Next';
		if (this[`show${direction}`] && !this.scrolling) {
			this.scroll(direction.toLowerCase());
		}
	}

	render() {
	  const styles = {
	    prev: {
			  display: (this.showPrev) ? 'block' : 'none',
	    },
	    next: {
			  display: (this.showNext) ? 'block' : 'none',
	    },
	    child: {
	    	left: this.leftPos,
	    }
	  };

	  const childNode = React.Children.map(this.props.children, (child) => React.cloneElement(child, { 
    	style: styles.child,
	  }));

  	return (
  		<div>
  			<div className="scroller scroller-prev" style={styles.prev} onClick={this.handleClick('prev')}>&#8249;</div>
  			<div className="scroller scroller-next" style={styles.next} onClick={this.handleClick('next')}>&#8250;</div>
  			<div className="wrapper" ref={this.wrapperElement} onWheel={this.handleWheel}>
  				{childNode}
  			</div>
  		</div>
  	);
	}
}

export default observer(Scrollable);
