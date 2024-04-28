<script lang="ts">

import { Table } from '@skeletonlabs/skeleton'
import type { TableSource } from '@skeletonlabs/skeleton'
import { onMount } from 'svelte'
import Memory from '../lib/components/Memory.svelte'
import Quiz from '../lib/components/Quiz.svelte'



let quiz = false
let memory = false
let flashcards = false
let newTermShow = false
let newSetShow = false
let flashcardsSection: HTMLDivElement

let categories = ['Language', 'Programming', 'Science']

let scores: any[] = []
let memoryScore: any[] = []

let studySet = [
	{
		id: 1,
		title: "Spanish Vocabulary",
		description: "Basic Spanish vocabulary words",
		category: "Language",
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
		category: "Programming",
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


function removeTerm(id: number) {
    currentSet.terms = currentSet.terms.filter(term => term.id !== id)
  }


let isFlipped = false
let front: boolean = true
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
	elemCarousel.scroll(x, 0)
}

function carouselRight(): void {
	const x =
		elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
			? 0 // loop
			: elemCarousel.scrollLeft + elemCarousel.clientWidth // step right
	elemCarousel.scroll(x, 0)
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
	currentSet = {
        ...currentSet,
        terms: [...currentSet.terms, newTerm]}
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
let newSetCategory = ''

let newSetTerms: { id: number, name: string, definition: string, category: string }[] = [{ id: 1, name: '', definition: '', category: '' }]

function addNewTermField() {
    const newId = newSetTerms.length > 0 ? newSetTerms[newSetTerms.length - 1].id + 1 : 1
    newSetTerms = [...newSetTerms, { id: newId, name: '', definition: '', category: ''}]
}

function removeNewTerm(index: number) {
    newSetTerms = newSetTerms.filter((_, i) => i !== index)
}


function addNewSet() {
	if (newSetTitle && newSetDescription) {
        const newSet = {
            id: studySet.length + 1,
            title: newSetTitle,
            description: newSetDescription,
			category: newSetCategory,
            terms: newSetTerms.map(term => ({ ...term })) 
        }
        studySet = [...studySet, newSet]


        newSetTitle = ''
        newSetDescription = ''
        newSetTerms = [{ id: 1, name: '', definition: '', category: '' }]
    } else {
        alert('Please enter both set title and description.')
    }

}
$: {
    console.log('Study Set changed:', studySet)
}

let newCategoryName = ''
let newCategoryShow = false

function addNewCategory() {
    if (newCategoryName !== '') {
        categories = [...categories, newCategoryName]
        newCategoryName = ''
    }
}


let editedCategory = false
let newEditCategory = ''
    let deleteConfirmation = false

    

	function saveEditedCategory(categoryIndex: number) {
    if (editedCategory && newEditCategory !== '') {
        const index = categories.findIndex(cat => cat === categories[categoryIndex])
        
        if (index !== -1) {
            const oldCategoryName = categories[index]
            categories[index] = newEditCategory
            
            studySet.forEach(set => {
                if (set.category === oldCategoryName) {
                    set.category = newEditCategory
                }
            })
    
            editedCategory = false
            newEditCategory = ''
        } else {
            console.error('Category not found.')
        }
    } else {
        console.error('Invalid operation: Either category name is empty or no category is being edited.')
    }
}


    function deleteCategory(categoryName: any) {
	
            categories = categories.filter(cat => cat !== categoryName)
            deleteConfirmation = false
        
    }

	function updateTermName(event: Event, termId: number) {
    const newName = (event.target as HTMLTableCellElement).innerText
    const termIndex = currentSet.terms.findIndex(term => term.id === termId)
      currentSet.terms[termIndex].name = newName
    
  }

  function updateTermDefinition(event: Event, termId: number) {
    const newDefinition = (event.target as HTMLTableCellElement).innerText
    const termIndex = currentSet.terms.findIndex(term => term.id === termId)
      currentSet.terms[termIndex].definition = newDefinition
    
  }

let total = 0
$: total = currentSet.terms.length
  function handleSaveScore(event) {
	const message = event.detail.message
    const score = event.detail.score
	const scoreObject = { score: score, message: message}
    scores = [...scores, scoreObject]
  }
$: console.log(scores)


function handleSaveMemory(event) {
	const message = event.detail.message
	const score = event.detail.score
	const scoreObject = { score: score, message: message}
	memoryScore = [...memoryScore, scoreObject]
  }
</script>

<main class="m-4">
	<h1 class="text-4xl font-bold uppercase text-center">Study Tools App</h1>
	<!--My Study Sets-->
	<div>
		<div class="flex justify-between">
			<h2 class="text-2xl font-bold">My Study Sets</h2>
			<div>
				<button class="btn variant-outline-primary" on:click={() => {newCategoryShow = true}}>Add A Category</button>
				{#if newCategoryShow}
				<div class="flex my-2">
					<input type="text" placeholder="Enter new category" class="p-2 rounded-md" bind:value={newCategoryName}>
					<button class="ml-2 btn variant-filled-primary" on:click={addNewCategory}>Add</button>
				</div>
				
				{/if}

				<button class="btn variant-outline-primary" on:click={() => {newSetShow = true}}>Add A Set</button>
				
			</div>
			
		</div>

		{#if newSetShow}
		<div class="p-4 mx-auto w-1/2  mt-4">
			<div class="flex gap-2">
				<input type="text" placeholder="Enter set title" class="p-2 rounded-md" bind:value={newSetTitle}>
			<input type="text" placeholder="Enter set description" class="p-2 rounded-md" bind:value={newSetDescription}>

			</div>
			<select class="p-2 mt-4 rounded-md" bind:value={newSetCategory}>
				<option value="">Select set category</option>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
			
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
	
		<div class="flex gap-4">
			{#each categories as category, index}
			<div>
				<div class="flex gap-4">
					{#if editedCategory}
					<input type="text" class="p-2 rounded-md" bind:value={newEditCategory} />
					<button class="btn variant-filled-primary" on:click={() => saveEditedCategory(index)}>Save</button>
					<button class="btn variant-outline-primary" on:click={() => {editedCategory = true}}>Cancel</button>
					{:else}
					<h2 class="text-xl font-bold">{category}</h2>
					<button class="items-center my-auto" on:click={() => {editedCategory = true}}><i class="fa-regular fa-pen-to-square"></i></button>
					<button class="items-center my-auto" on:click={deleteCategory(category)}><i class="fa-solid fa-trash"></i></button>
					{/if}
				</div>
		
				<div class="flex gap-4 my-4 border-2 border-primary-500 rounded-lg">
					{#each studySet.filter(set => set.category === category) as set}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="card m-4" on:click={() => chooseCurrentSet(set.title)}>
						<header class="card-header text-xl font-bold underline underline-offset-2">{set.title}</header>
						<div class="flex gap-2 items-center">
							
                <select bind:value={set.category} class=" mx-4 mt-2 p-2 rounded-md">
                    {#each categories as cat}
                        <option value={cat}>{cat}</option>
                    {/each}
                </select>
                
						</div>
						<section class="p-4">{set.description}</section>
						<footer class="card-footer"><span class="underline">Terms: </span>{set.terms.length}</footer>
					</div>
					{/each}
				</div>
			</div>
			{/each}
		</div>
		

	<!--Choose How to Study-->
	<div>
		<h2 class="text-2xl font-bold text-center my-5">Choose How to Study <span class="text-primary-500 underline">{currentSet.title}</span></h2>
		<div class="flex gap-4 justify-center">
			<button class="btn variant-outline-primary p-20 font-bold text-3xl hover:variant-filled-primary" on:click={() => {quiz = true}}>Quiz</button>
			<button class="btn variant-outline-primary p-20 font-bold text-3xl hover:variant-filled-primary" on:click={() => {memory = true}}>Memory<br> Game</button>
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
			<table class="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
				<thead>
				  <tr>
					<th class="px-4 py-2 text-left">Name</th>
					<th class="px-4 py-2 text-left">Definition</th>
					<th class="px-4 py-2 text-left">Actions</th>
				  </tr>
				</thead>
				<tbody>
				  {#each currentSet.terms as term (term.id)}
				  <tr class="border-b border-gray-200 hover:bg-gray-100">
					<td class="px-4 py-2" contenteditable on:input={(event) => updateTermName(event, term.id)}>{term.name}</td>
					<td class="px-4 py-2" contenteditable on:input={(event) => updateTermDefinition(event, term.id)}>{term.definition}</td>
					<td class="px-4 py-2">
					  <button class="text-primary-600 hover:text-primary-900" on:click={() => removeTerm(term.id)}>
						<i class="fa-solid fa-trash"></i>
					  </button>
					</td>
				  </tr>
				  {/each}
				</tbody>
			  </table>
			
		</div>

	</div>
	{/if}

	{#if quiz}

	<div class="flex gap-2 w-1/2 mt-5 mx-auto">
		<h2 class="text-xl font-bold text-center ">Quiz Scores:</h2>
		{#each scores as score}
		<div class="flex gap-2">
			<p class="text-xl font-bold"> {score.score}/{total}  </p>
			<p class="text-m font-bold">({score.message}),</p>
		</div>
			
		{/each}
	</div>


	<div class="mx-auto w-1/2 my-4 flex justify-between">
		<Quiz {currentSet} on:saveScore={handleSaveScore} />
		<i class="fa-solid fa-x inline-block align-middle hover:scale-110 hover:text-primary-500" on:click={() => { quiz = false }}></i>
		
	</div>

	


	{/if}

	{#if memory}

	<div class="flex gap-2 w-1/2 mt-5 mx-auto">
		<h2 class="text-xl font-bold text-center ">Game Scores:</h2>
		{#each memoryScore as score}
		<div class="flex gap-2">
			<p class="text-xl font-bold"> {score.score}/{total}  </p>
			<p class="text-m font-bold">({score.message}),</p>
		</div>
			
		{/each}
	</div>
	<div class="mx-auto w-1/2 my-4 flex justify-between">
	 <div><Memory {currentSet} on:saveScore={handleSaveMemory} /></div>
	 <i class="fa-solid fa-x inline-block align-middle hover:scale-110 hover:text-primary-500" on:click={() => { memory = false }}></i>
	</div>

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

