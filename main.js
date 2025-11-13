window.MathJax = {
	loader: {load: ['input/asciimath', 'output/chtml']},
	chtml: { display: true }
};

document.addEventListener('DOMContentLoaded', main)

// Class name to displayable name
const referenceable_class_to_display_name = {
	"proposition" : "Proposição"
};

function main ()
{
	const internalReferenceables = document.querySelectorAll("div[name], p[name]");

	const referenceable_index = {"global": 1};

	for (const referenceable of internalReferenceables)
	{
		referenceable.setAttribute("id", `referenceable_${referenceable_index["global"]}`);

		referenceable_index["global"] += 1;

		referenceableClassName = referenceable.getAttribute("class");

		referenceable.setAttribute("data-referenceable-class", referenceableClassName);

		if ( !(referenceableClassName in referenceable_index) )
		{ referenceable_index[referenceableClassName] = 1; }

		let current_index = referenceable_index[referenceableClassName];

		referenceable.setAttribute("data-index", current_index);

		referenceable_index[referenceableClassName] = current_index+1;

		// Title
		const title = document.createElement("p");

		referenceableClassDisplayName = referenceable_class_to_display_name[referenceableClassName];

		title.textContent = `${referenceableClassDisplayName} ${current_index}: ${referenceable.getAttribute("name")}`;

		title.setAttribute("class", "title");

		referenceable.prepend(title);
	}

	// Anchor normalization

	const anchors = document.querySelectorAll("a:not([href])");

	for (const anchor of anchors)
	{
		let found_referenced = false;
		let referenceable = null;
		let referenceable_index = 0;

		// Look for referenceable with name equal to anchor text content
		while (referenceable_index < internalReferenceables.length && !found_referenced)
		{
			referenceable = internalReferenceables[referenceable_index];

			if (referenceable.getAttribute("name") == anchor.textContent)
			{
				found_referenced = true;

				anchor.setAttribute("href", `#${referenceable.id}`);

				referenceableClassDisplayName = referenceable_class_to_display_name[referenceableClassName];

				anchor.textContent = `[${referenceable.firstChild.textContent}]`;
			}

			referenceable_index++;
		}
	}
}