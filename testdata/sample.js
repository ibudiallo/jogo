var sample = {
	key : "b",
	value: 1234,
	num: 1.234,
	empties: [],
	items: [1,2,3,4,5],
	books: {
		big_num : "1"
	},
	products: [
		{
			id: 124,
			type: "book",
			quantity: 5,
		},{
			id: 12,
			type: "book",
			quantity: 3,
		}
	],
	"hello": [{}],
	Boxes: [
		[1,2],
		[1,1],
	],
	my_box: [[]]
};

var xmlsample = `<plane>
   <date>
	<day>1</day>
	<month>12</month>
	<year>2009</year>
   </date>
   <make> Cessna </make>
   <model id="name"> Skyhawk </model>
   <colors type="list" id="124">
     <color>Light</color>
     <color>Black</color>
     <color>Blue</color>
   </colors>
</plane>`;
