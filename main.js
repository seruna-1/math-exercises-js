window.MathJax = {
	loader: {load: ['input/asciimath', 'output/chtml']},
	chtml: { display: true }
};

document.addEventListener('DOMContentLoaded', main)

// Class name to displayable name
const referenceable_class_to_display_name = {
	"proposition" : "Proposição",
	"local" : "Proposição temporária"
};

function main ()
{
	const internalReferenceables = document.querySelectorAll("div[name], p[name]");

	const referenceable_index = {
		"global": 1, // Document wide counter (every referenceable has)
		"local": 1 // Local counter, lasts inside a section
		// Rest of class counters
	};

	let last_section = null;

	for (const referenceable of internalReferenceables)
	{
		// Assign id to be able to create anchors to it
		referenceable.setAttribute("id", `referenceable_${referenceable_index["global"]}`);

		referenceable_index["global"] += 1;

		// TODO: handle multiple referenceable classes (classList)
		referenceableClassName = referenceable.getAttribute("class");

		// Reset local counter on new section
		let section = referenceable.parentElement;

		while ( section.tagName != "SECTION" )
		{
			section = section.parentElement;
		}

		if (referenceableClassName == "local") { last_section = section; }

		referenceable.setAttribute("data-referenceable-class", referenceableClassName);

		// Create counter for this class if first occurence
		if ( !(referenceableClassName in referenceable_index) )
		{ referenceable_index[referenceableClassName] = 1; }

		// Class counter current value
		let current_index = referenceable_index[referenceableClassName];

		// Increase class counter
		referenceable_index[referenceableClassName] = current_index+1;

		referenceableClassDisplayName = referenceable_class_to_display_name[referenceableClassName];

		let title = null;

		// Title
		if (referenceable.tagName == "DIV")
		{
			title = document.createElement("p");
			title.textContent = `${referenceableClassDisplayName} ${current_index}: ${referenceable.getAttribute("name")}`;
			referenceable.prepend(title);
		}
		else if (referenceable.tagName == "P")
		{
			title = document.createElement("span");
			title.textContent = ` [${referenceableClassDisplayName} ${current_index}: ${referenceable.getAttribute("name")}]`;
			referenceable.append(title);
		}

		title.setAttribute("class", "title");
	}

	// Anchor completion

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

				if (referenceable.classList.contains("local"))
				{
					anchor.textContent = `[${referenceable.lastChild.textContent}]`;
				}
				else
				{
					anchor.textContent = `[${referenceable.firstChild.textContent}]`;
				}
			}

			referenceable_index++;
		}
	}
}