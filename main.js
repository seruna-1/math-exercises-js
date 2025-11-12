window.MathJax = {
	loader: {load: ['input/asciimath', 'output/chtml']},
	chtml: { display: true }
};

document.addEventListener('DOMContentLoaded', main)

function main ()
{
	const internalReferenceables = document.querySelectorAll("div[id]");

	const anchors = document.querySelectorAll("a");

	for (const anchor of anchors)
	{
		const href = anchor.getAttribute("href");

		if ( href.startsWith("#") )
		{
			let id = href.slice(1);

			let found_referenced = false;
			let referenceable = null;
			let referenceable_index = 0;

			while (referenceable_index < internalReferenceables.length && !found_referenced)
			{
				referenceable = internalReferenceables[referenceable_index];
				if (referenceable.id == id)
				{
					found_referenced = true;
					console.log(referenceable)
					referenceable.setAttribute("name", `Proposição ${referenceable_index}`);

					anchor.textContent = `Proposição ${referenceable_index} (${id})`;
				}

				referenceable_index++;
			}
		}
	}
}