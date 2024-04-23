<script lang="ts">

import { Table } from '@skeletonlabs/skeleton'
import type { TableSource } from '@skeletonlabs/skeleton'



let quiz = false
let memory = false
let flashcards = false
let newTermShow = false
let newSetShow = false
let flashcardsSection: HTMLDivElement

let studySet = [
	{
		id: 1,
		title: "Spanish Vocabulary",
		description: "Basic Spanish vocabulary words",
		terms: [
			{
				id: 1,
				name: "Hola",
				definition: "Hello"
			},
			{
				id: 2,
				name: "Adios",
				definition: "Goodbye"
			},
			{
				id: 3,
				name: "Gato",
				definition: "Cat"
			},
			{
				id: 4,
				name: "Perro",
				definition: "Dog"
			},
			{
				id: 5,
				name: "Casa",
				definition: "House"
			},
			{
				id: 6,
				name: "Libro",
				definition: "Book"
			},
			{
				id: 7,
				name: "Rojo",
				definition: "Red"
			},
			{
				id: 8,
				name: "Azul",
				definition: "Blue"
			},
			{
				id: 9,
				name: "Verde",
				definition: "Green"
			},
			{
				id: 10,
				name: "Amarillo",
				definition: "Yellow"
			}
		]
	},
	{
		id: 2,
		title: "JavaScript Basics",
		description: "Fundamental concepts in JavaScript",
		terms: [
			{
				id: 1,
				name: "Variable",
				definition: "A container for storing data values"
			},
			{
				id: 2,
				name: "Function",
				definition: "A block of code that can be called and executed"
			},
			{
				id: 3,
				name: "Array",
				definition: "A data structure that stores a collection of elements"
			}
		]
	}
]

$: studySet = studySet
let currentSet = studySet[0]

function chooseCurrentSet(setName: string) {
	currentSet = studySet.filter(set => set.title === setName)[0]
	console.log(currentSet)
}

function tableMapperValues(data: any[], keys: string[]): TableSource['body'] {
  return data.map(item => keys.map(key => item[key]));
}

const tableSimple: TableSource = {
	head: ['Term #', 'Name', 'Definition'],
	body: tableMapperValues(currentSet.terms, ['id', 'name', 'definition']),
}
$: {
    tableSimple.body = tableMapperValues(currentSet.terms, ['id', 'name', 'definition']);
}


let isFlipped = false;
let front: boolean = true;
	let back: boolean

  function toggleCard() {
    isFlipped = !isFlipped
	if (isFlipped) {
	  front = false
	  back = true
  } else {
	  back = false
	  front = true
  }
  
  }
  console.log(currentSet)

  let elemCarousel: HTMLDivElement
 
  function carouselLeft(): void {
	const x =
		elemCarousel.scrollLeft === 0
			? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
			: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
	elemCarousel.scroll(x, 0);
}

function carouselRight(): void {
	const x =
		elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
			? 0 // loop
			: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
	elemCarousel.scroll(x, 0);
}
	
let newTermName = ''
let newTermDefinition = ''

function addNewTerm() {
    if (newTermName && newTermDefinition) {
        const newTerm = {
            id: currentSet.terms.length + 1, 
            name: newTermName,
            definition: newTermDefinition
        }

        addTermToSet(newTerm)

        newTermName = ''
        newTermDefinition = ''
    } else {
        alert('Please enter both term and definition.')
    }
}

function addTermToSet(newTerm: { id: number, name: string, definition: string }) {
    currentSet.terms.push(newTerm)
    tableSimple.body = tableMapperValues(currentSet.terms, ['id', 'name', 'definition'])
	newTermShow = false
}

function showFlashcards() {
	flashcards = true
    Promise.resolve().then(() => {
        flashcardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
}




let newSetTitle = ''
let newSetDescription = ''

let newSetTerms: { id: number, name: string, definition: string }[] = [{ id: 1, name: '', definition: '' }];

function addNewTermField() {
    const newId = newSetTerms.length > 0 ? newSetTerms[newSetTerms.length - 1].id + 1 : 1
    newSetTerms = [...newSetTerms, { id: newId, name: '', definition: '' }]
}

function removeNewTerm(index: number) {
    newSetTerms.splice(index, 1)
}

function addNewSet() {
	if (newSetTitle && newSetDescription) {
        const newSet = {
            id: studySet.length + 1,
            title: newSetTitle,
            description: newSetDescription,
            terms: newSetTerms.map(term => ({ ...term })) 
        }
        studySet = [...studySet, newSet]


        newSetTitle = ''
        newSetDescription = ''
        newSetTerms = [{ id: 1, name: '', definition: '' }]
    } else {
        alert('Please enter both set title and description.')
    }

}
$: {
    console.log('Study Set changed:', studySet)
}



</script>

<main class="m-4">
	<h1 class="text-4xl font-bold uppercase text-center">Study Tools App</h1>
	<!--My Study Sets-->
	<div>
		<div class="flex justify-between">
			<h2 class="text-2xl font-bold">My Study Sets</h2>
			<button class="btn variant-outline-primary" on:click={() => {newSetShow = true}}>Add A Set</button>
		</div>

		{#if newSetShow}
		<div class="p-4 mx-auto w-1/2  mt-4">
			<div class="flex gap-2">
				<input type="text" placeholder="Enter set title" class="p-2 rounded-md" bind:value={newSetTitle}>
			<input type="text" placeholder="Enter set description" class="p-2 rounded-md" bind:value={newSetDescription}>

			</div>
			
			{#each newSetTerms as term, index}
			<div class="flex gap-2 my-2">
				<input type="text" placeholder="Enter term" class="p-2 rounded-md" bind:value={term.name}>
				<input type="text" placeholder="Enter definition" class="p-2 rounded-md" bind:value={term.definition}>
				<i class="fa-solid fa-x" on:click={() => removeNewTerm(index)}></i>
				
				
			</div>
			{/each}
			<div>
				<button class="btn variant-filled-primary" on:click={addNewTermField}>Add Term</button>
				<div class="flex gap-2 my-2">
					<button class="btn variant-outline-primary" on:click={() => { newSetShow = false }}>Cancel</button>
					<button class="btn variant-filled-primary" on:click={addNewSet}>Add Set</button>
				</div>
				
				
			</div>
			
	
			
		</div>
		
		{/if}


		<div class="flex gap-4 my-4 border-2 border-primary-500 rounded-lg">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#each studySet as set}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="card m-4" on:click={() => chooseCurrentSet(set.title)}>
				<header class="card-header text-xl font-bold underline underline-offset-2">{set.title}</header>
		<section class="p-4">{set.description}</section>
		<footer class="card-footer"><span class="underline">Terms: </span>{set.terms.length}</footer>
			</div>
	
			{/each}
		</div>
		
	</div>


	<!--Choose How to Study-->
	<div>
		<h2 class="text-2xl font-bold text-center my-5">Choose How to Study</h2>
		<div class="flex gap-4 justify-center">
			<button class="btn variant-outline-primary p-20 font-bold text-3xl hover:variant-filled-primary">Quiz</button>
			<button class="btn variant-outline-primary p-20 font-bold text-3xl hover:variant-filled-primary">Memory<br> Game</button>
			<button class="btn variant-outline-primary p-20 font-bold text-3xl hover:variant-filled-primary" on:click={showFlashcards}>Flash<br> Cards</button>
		</div>

	</div>


	<!--Terms for Current Set-->
	{#if !quiz || !memory || !flashcards}
	<div class="mt-5 w-1/2 mx-auto">
		<div class="flex justify-between">
			<h2 class="text-xl font-bold text-center my-5">Terms in This Set</h2>
			<button class="btn variant-outline-primary" on:click={() => { newTermShow = true }}>Add A Term</button>
		</div>
		{#if newTermShow}
		<div class="card p-4 grid grid-cols-2 gap-4 mx-auto w-1/2 items-center mt-4">
			<input type="text" placeholder="Enter term" class="p-2 rounded-md" bind:value={newTermName}>
			<input type="text" placeholder="Enter definition" class="p-2 rounded-md" bind:value={newTermDefinition}>
			<button class="btn variant-outline-primary" on:click={() => { newTermShow = false }}>Cancel</button>
			<button class="btn variant-filled-primary" on:click={addNewTerm}>Add Term</button>
			
		</div>
		
		{/if}

		<div class="mt-4">
			<Table source={tableSimple} />
			
		</div>
	</div>
	{/if}

	{#if quiz}

	{/if}

	{#if memory}

	{/if}

	<div bind:this={flashcardsSection}>
		{#if flashcards}
		<div class=" w-1/3 mx-auto h-screen" >
			<div class="flex justify-between items-center">
				<h2 class="text-2xl font-bold my-5">Flashcards</h2>
				<i class="fa-solid fa-x inline-block align-middle hover:scale-110 hover:text-primary-500" on:click={() => { flashcards = false }}></i>
			</div>
				
				<div class="card p-4 grid grid-cols-[auto_auto_auto] gap-4	mx-auto items-center mt-4">
					<!-- Button: Left -->
					<button type="button" class="btn-icon variant-filled" on:click={carouselLeft}>
						<i class="fa-solid fa-arrow-left white" />
					</button>
					<!-- Carousel -->
					<div bind:this={elemCarousel} class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
						{#each currentSet.terms as term}
						
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="card min-w-96 h-64 p-2 m-1 snap-start bg-white" on:click={toggleCard}>
							{#if front}
								<div class="front flex justify-center items-center p-6 bg-white">
								  <p class="align-middle text-3xl uppercase font-bold">{term.name}</p>
								</div>
								{/if}
								{#if back}
								<div class="back flex justify-center items-center p-6 bg-white">
									<p class="align-middle text-2xl uppercase font-bold">{term.definition}</p>
								</div>
								{/if}
							</div>
						{/each}
					</div>
					<!-- Button: Right -->
					<button type="button" class="btn-icon variant-filled" on:click={carouselRight}>
						<i class="fa-solid fa-arrow-right" />
					</button>
				</div>
	
		</div>
	
	
	{/if}
	</div>
	










</main>

