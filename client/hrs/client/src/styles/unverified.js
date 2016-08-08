const uvStyles ={
	ul: {  
		listStyleType: 'none',
  	width: 320,
  	background: 'lightcyan'
	},
	li: {
	  padding: 10,
	  overflow: 'auto',
	  borderBottom: '1px solid green',
    ':hover': {
    	transform: 'translateX(30px) rotate(7deg) scale(1.3,1.3)',
      	backgroundColor: 'aquamarine'
    },

	},
	lia: {
	  textDecoration: 'none',
	  color: 'green',
	  display: 'block',
	  width: 300,
	},
	inp: {
		backgroundColor: 'beige',
		fontSize: '1.2em',
		height: 40,
		width: 300
	},
	di: {
		fontFamily:"'Roboto', sans-serif",
		fontStretch: 'ultra-condensed'
	},
	ck: {
		color: 'green',
		fontSize: '1.4em'
	}

}

export {uvStyles}