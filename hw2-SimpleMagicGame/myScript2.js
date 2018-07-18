const BITS = 6;	// How many cards
var i, j;


for(i = 0 ; i < BITS ; i++){

	if(i % 3 == 0){
		document.writeln("<div>");	
	}

	//	****************************
	//		Title of Each Cards
	//	****************************
	
	document.writeln("<table>");
	document.writeln("<tr class=\"colored\">");
	document.writeln('<td colspan="8">' + '第' + (i+1) + '張卡片' + '<input type = "checkbox">' + "</td>");
	document.writeln("</tr>");
	
	//	*****************************
	//		Print Numbers in Cards
	//	*****************************

	var count = 0;	//	count for 8 numbers per line
	var binary = 1;	//	binary number with specific index equals to 1	
	for(k = 0 ; k < i ; k++)
		binary *= 2;
	
	for(j = 1 ; j <= 63 ; j++){
		//	using bitwise operator to detetmine if the number has to be printed
		if((j & binary) == binary){
			
			if(count % 8 == 0){
				document.writeln("<tr style=\"color: white\">");
				document.writeln('<td>' + j + '</td>');
			}
			else if(count % 8 == 7){
				document.writeln('<td>' + j + '</td>');
				document.writeln("</tr>");
			}
			else{
				document.writeln('<td>' + j + '</td>');
			}
			count++;
		}
	}
	document.writeln("</table>");

	if(i % 3 == 2){
		document.writeln("</div>");
	}
	
}