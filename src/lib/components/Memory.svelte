<script lang='ts'>

 interface Term {
  name: string;
  definition: string;
}

 interface Set {
  terms: Term[];
}

    export let terms: Set;

    type State = 'start' | 'playing' | 'won' | 'lost'

    let state: State = 'start'

    let size = 20
    let grid = createGrid()

    function createGrid() {
        let cards = new Set<string>()
            let maxSize = size / 2

            while (cards.size < maxSize) {
                let randomIndex = Math.floor(Math.random() * terms.terms.length)
                cards.add(terms.terms[randomIndex].name)
                
            }

            return shuffle([...cards, ...cards])
    }

    function shuffle<Items>(array: Items[]) {
        return array.sort(() => Math.random() - 0.5)
    }

    console.log(grid)
</script>