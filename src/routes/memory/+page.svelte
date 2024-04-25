<script lang='ts'>

interface Term {
  id: number;
  name: string;
  definition: string;
}
   
    interface Set {
     terms: Term[];
   }
   
//       export let terms: Set;

let studySet = {
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
        }
   
       type State = 'start' | 'playing' | 'won' | 'lost'
   
       let state: State = 'start'
   
       let size = 20
       let grid = createGrid()
       let maxMatches = grid.length / 2
       let selected: number[] = []
       let matches: string[] = []
   
       function createGrid() {
  let terms = [];

  // Iterate through each term in the study set
  for (const term of studySet.terms) {
    // Push the term name
    terms.push({ id: term.id, content: term.name, type: 'name' });
    // Push the term definition
    terms.push({ id: term.id, content: term.definition, type: 'definition' });
  }

  // Shuffle the terms
  let shuffledTerms = shuffle(terms);

  // Return only the term IDs for the grid
  return shuffledTerms.map(term => term.id);
}





   
       function shuffle<Items>(array: Items[]) {
           return array.sort(() => Math.random() - 0.5)
       }
   
   //    console.log(grid)


   function selectCard(cardIndex: number) {
    selected = selected.concat(cardIndex)

   }

   function matchCards() {
    const [first, second] = selected;

    // Check if the current pair of selected cards has already been matched
    const isAlreadyMatched = matches.some(matchId => matchId === first || matchId === second);

    // If the pair has not already been matched, proceed with matching
    if (!isAlreadyMatched) {
        // Retrieve the term objects corresponding to the selected indices
        const firstTerm = studySet.terms.find(term => term.id === first);
        const secondTerm = studySet.terms.find(term => term.id === second);

        // Check if the selected cards have the same name and definition
        if (firstTerm && secondTerm && firstTerm.name === secondTerm.name && firstTerm.definition === secondTerm.definition) {
            // If there's a match, add the IDs to the matches array
            matches = matches.concat(first, second);
        }
    }

    // Clear the selected cards after a delay
    setTimeout(() => (selected = []), 300);
}





   function gameWon() {
state = 'won'
   }


   console.log(state, selected, matches)
   $: selected.length === 2 && matchCards()
   $: maxMatches === matches.length && gameWon()


   </script>

   {#if state === 'start'}
   <h1> Matching Game</h1>
   <button on:click={() => state = 'playing'}>Play</button>
   {/if}

    {#if state === 'playing'}

    <div class="matches">
        {#each matches as matchId}
        {#each studySet.terms as term}
        {#if term.id === matchId}
        <div>{term.name} - {term.definition}</div>
        {/if}
        {/each}
        {/each}
      </div>
      
      <div class="cards">
    
        {#each studySet.terms as term}
        {@const isSelected = selected.includes(term.name)}
       
        <button class="card {isSelected ? 'selected' : ''}"  on:click={() => selectCard(term.id)}>
            <div class="matches">{term.name}</div>
        </button>
    {/each}
     
    {#each studySet.terms as term}
    {@const isSelected = selected.includes(term.definition)}
   
    <button class="card {isSelected ? 'selected' : ''}"  on:click={() => selectCard(term.id)}>
        <div class="matches">{term.definition}</div>
    </button>
{/each}
        
        

      </div>
      
      
      
      
      
      
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
    .cards {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: .4rem;
    }
    .card {
        height: 140px;
        width: 140px;
        font-size: 4rem;
        background-color: lightblue;

        &.selected {
            border: 4px solid red;
        }

        &.card:disabled {
            background-color: lightgray;
        }
    }
    .matches {
        display: flex;
        gap: 1rem;
        margin-block: 2rem;
        font-size: 3rem;
    }
    </style>