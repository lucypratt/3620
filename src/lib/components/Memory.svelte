<script lang='ts'>
    import { createEventDispatcher  } from 'svelte'
	import Layout from '../../routes/+layout.svelte';

interface Term {
  id: number
  name: string
  definition: string
}
   
    interface Set {
     terms: Term[]
   }
   
export let currentSet: {
      id: number,
      title: string,
      description: string,
      category: string,
      terms: { id: number, name: string, definition: string }[]
    }

const dispatch = createEventDispatcher()
/* 
let studySet = {
    id: 1,
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
        } */
   
       type State = 'start' | 'playing' | 'won' | 'lost'
   
       let state: State = 'start'
   
     
       let grid = createGrid()
       let maxMatches = grid.length / 2
       let selected: number[] = []
       let selectedOutline: number[] = []
       let matches: string[] = []
   
       function createGrid() {
  let terms = []


  for (const term of currentSet.terms) {
    terms.push({ id: term.id, content: term.name, type: 'name' })
    terms.push({ id: term.id, content: term.definition, type: 'definition' })
  }
  let shuffledTerms = shuffle(terms)

  return shuffledTerms.map(term => term.id)
}

       function shuffle<Items>(array: Items[]) {
           return array.sort(() => Math.random() - 0.5)
       }



   function selectCard(cardIndex: number) {
    if (selectedOutline.length === 2) {
        selectedOutline = []
    }
    
   selectedOutline = selectedOutline.concat(cardIndex)
    const absCardIndex = Math.abs(cardIndex)
    selected = selected.concat(absCardIndex)

}


   function matchCards() {
    const [first, second] = selected
    const isAlreadyMatched = matches.some(matchId => matchId === first || matchId === second)
    if (!isAlreadyMatched) {
        const firstTerm = currentSet.terms.find(term => term.id === first)
        const secondTerm = currentSet.terms.find(term => term.id === second)

        if (firstTerm && secondTerm && firstTerm.name === secondTerm.name && firstTerm.definition === secondTerm.definition) {

            matches = matches.concat(first, second)
        }
    }
    setTimeout(() => (selected = []), 300);
}





   function gameWon() {
state = 'won'
   }


   console.log(state, selected, matches)
   $: selected.length === 2 && matchCards()
   $: maxMatches === matches.length && gameWon()

   let matchedTerms


   $: {
        const uniqueMatches = new Set(matches)
        matchedTerms = Array.from(uniqueMatches).map(matchId => currentSet.terms.find(term => term.id === matchId))
    }
$: console.log("matched terms array", matchedTerms)

let finished = false

let scoreMessage = ''
let correctCount: number
$: correctCount = matchedTerms.length
function saveScores() {
    dispatch('saveScore', { score: correctCount, message: scoreMessage })
        restart()
}

function restart() {
    state = 'start'
    selected = []
    selectedOutline = []
    matches = []
    matchedTerms = []
    finished = false
}

   </script>


   {#if state === 'start'}
   <div class=" text-center">
    <h1 class="text-3xl text-center mx-auto font-bold underline my-4"> Matching Game</h1>
    <button class="btn variant-filled-primary text-center mx-auto justify-center" on:click={() => state = 'playing'}>Play</button>
   </div>
  
   {/if}

    {#if state === 'playing'}

<h1 class="text-3xl text-center mx-auto font-bold underline my-4"> Matching Game</h1>
    <div class="flex gap-10 m-20 justify-center w-1/2 mx-auto">
        <div>
            <div class="flex flex-wrap gap-4 ">
                {#each currentSet.terms as term}
                    {@const isTermSelected = selectedOutline.includes(term.id)}
                    {@const isMatched = matchedTerms.includes(term.id)}
                    <button class="card btn variant-filled-primary text-white text-2xl {isTermSelected ? 'selected' : ''} {isMatched ? 'disabled' : ''} text-center items-center" on:click={() => selectCard(term.id)}>
                        {term.name}
                    </button>
                {/each}
            
                {#each currentSet.terms as term}
                {@const isDefinitionSelected = selectedOutline.includes(-term.id)}
                    <button class="card btn variant-filled-primary text-white text-2xl {isDefinitionSelected ? 'selected' : ''}" on:click={() => selectCard(-term.id)}>
                        {term.definition}
                    </button>
                {/each}
            </div>

        </div>

        <div>
            <h3 class="text-3xl font-bold mb-4">Total Matches {matchedTerms.length} / {currentSet.terms.length}</h3>
            <div class="matches">
                {#each matchedTerms as matchedTerm}
                    <div class="text-xl my-4"><span class="font-bold">{matchedTerm.name}</span> - {matchedTerm.definition}</div>
                {/each}
            </div>
            
        </div>



    </div>
    <div class="justify-center text-center w-1/2 mx-auto">
        <button class="btn variant-filled-primary text-center mx-auto justify-center text-white" on:click={() => finished = true}>I'm Finished</button>


    </div>
   
    {#if finished}
    <div class="justify-center w-1/2 mx-auto">
        <h3 class="text-3xl font-bold mb-4 text-center">Your Score: {matchedTerms.length} / {currentSet.terms.length}</h3>

        <div class="text-center">
            <input type="text" placeholder="Leave a note on score" class="p-2 rounded-md" bind:value={scoreMessage}>
              <button class="btn variant-filled-primary mt-4 text-white" on:click={saveScores}>Save and Restart</button>
              <button class="btn variant-filled-primary mt-4 text-white" on:click={restart}> Discard and Restart</button>
              
          </div>
    </div>
    {/if}
    
      
     
    
    
      
      
      
    {/if}

    {#if state === 'lost' }
    <h1> You lost! </h1>
    <button on:click={() => state = 'playing'}>Play again</button>
    {/if}

    {#if state === 'won' }
    <h1> You win! </h1>
    <button on:click={() => state = 'playing'}>Play again</button>
    {/if}

    <style>
   /*  .cards {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: .4rem;
    } */
 
   
    .disabled {
        background-color: lightgray;
    }
    .selected {
            border: 4px solid black;
        }
  
    </style>