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

var xmlsample = `<!-- xslplane.1.xml -->
<?xml-stylesheet type = "text/xsl"  href = "xslplane.1.xsl" ?>
<plane>
   <year> 1977 </year>
   <make> Cessna </make>
   <model> Skyhawk </model>
   <color> Light blue and white </color>
</plane>`;
