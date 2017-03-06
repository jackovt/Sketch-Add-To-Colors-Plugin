
//-------------------------------------------------------------------------------------------------------------
// Add to color palette
//-------------------------------------------------------------------------------------------------------------

function addToColors(context, target) {
	
	var app = NSApp.delegate();
	var doc = context.document;
	var version = context.plugin.version().UTF8String();
	var newColors = [];
	
	// Get colors from target color picker section
	
	if (target == "global") {
		var colors = app.globalAssets().colors()	
	} else if (target == "document") {
		var colors = doc.documentData().assets().colors();
	}

	if (colors.length > 0) {
		for (var c = 0; c < colors.length; c++) {
			newColors.push(colors[c]);
		}
	}

	var selectedColor = getFirstReferenceColor(context);

	if (selectedColor !== null) {
		newColors.push(selectedColor);
		if (target == "global") {
			app.globalAssets().setColors(newColors);
		} else if (target == "document" ) {
			doc.documentData().assets().setColors(newColors);
		}
		
		app.refreshCurrentDocument();
	} else {
		return;
	}
}

//-------------------------------------------------------------------------------------------------------------
// Get color of the layer
//-------------------------------------------------------------------------------------------------------------
function getColorOf(layer) {
	var color = null;
	switch ([layer class]) {
		case MSTextLayer:
			color = layer.textColor();
			// Check if text layer has a fill color

			var fill = layer.style().fills().firstObject();
			if (fill != undefined && fill.isEnabled()) color = fill.color();
		break;
		default:
			var fill = layer.style().fills().firstObject();
			if (fill != undefined && fill.isEnabled()) color = fill.color();
		break;
	}
	return color;
}

//-------------------------------------------------------------------------------------------------------------
// Get color of the first selected layer
//-------------------------------------------------------------------------------------------------------------
function getFirstReferenceColor(context) {
	// Error handling
	if(!selectionErrorHandling(context)) return null;

	var selectedLayer = context.selection.firstObject();
	if (selectedLayer.class() == MSShapeGroup){
    	var color = firstVisibleFill(selectedLayer).color();
    	if (color != undefined) {
			return color;
    	}
	}
}

function firstVisibleFill(layer)
{
	for(var i = 0; i < layer.style().fills().count(); i++)
	{
		var fill = layer.style().fills().objectAtIndex(i);
		if(fill.isEnabled())
		{
			return fill;
		}
	}
	
	return false;
}

//-------------------------------------------------------------------------------------------------------------
// Selection Error Handling
//-------------------------------------------------------------------------------------------------------------
function selectionErrorHandling(context)
{
	if(context.selection.count() == 0) // Nothing selected
	{
		[[NSApplication sharedApplication] displayDialog:"You must select a layer in order to use this plugin." withTitle:"No layers selected!"];
		return false;
	}
	
	if(context.selection.count() > 1) // More than one layer selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with multiple layers. Please select a single layer and try again." withTitle:"Multiple layers selected!"];
		return false;
	}
	
	var firstObject = context.selection.firstObject();
	if([firstObject class] == MSLayerGroup) // Group selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with groups. Please select a layer instead." withTitle:"You've selected a group!"];
		return false;
	}
	
	if([firstObject class] == MSSliceLayer) // Slice selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with slices. Please select a layer instead." withTitle:"You've selected a slice!"];
		return false;
	}
	
	return true;
}


//-------------------------------------------------------------------------------------------------------------
// Menu Items
//-------------------------------------------------------------------------------------------------------------


// Global Colors

function addToDocumentColors(context) {
	addToColors(context, "document");
}

function addToGlobalColors(context) {
	addToColors(context, "global");
}

