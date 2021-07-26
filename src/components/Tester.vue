<template>
  <div class="flex flex-col justify-center items-center h-full">
    <!-- Render this part at the start -->
    <div
      v-if="!started"
      class="flex flex-col justify-center items-center h-full"
    >
      <h2>Mental maths methods</h2>
      <div class="p-col-12 flex flex-row m-2">
        <label class="m-2" for="diff">Difficulty</label>
        <SelectButton
          id="diff"
          v-model="difficulty"
          :options="difficulties"
          optionLabel="text"
          optionValue="difficulty"
        />
      </div>
      <div class="p-col-12 flex flex-row m-2">
        <label class="m-2" for="opt">Options</label>
        <SelectButton
          id="opt"
          v-model="option"
          :options="options"
          :multiple="true"
        />
      </div>
      <div class="p-col-12 flex flex-row m-2">
        <label class="m-2" for="amt">Amount</label>
        <SelectButton id="amt" v-model="amount" :options="amounts" />
      </div>
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
        "
        @click="startTest"
      >
        Start
      </button>
    </div>
    <!-- Render this part once the test starts -->
    <div
      v-if="started && !finished"
      class="flex flex-col justify-center items-center h-full"
    >
      <h2>Timer: {{ elapsed }}</h2>
      <h2>Questions left: {{ amount - answered }}</h2>
      <div>{{ question }}</div>
      <InputNumber v-model="answer" @input="checkAnswer" />
    </div>
    <!-- Render this part at the end -->
    <div
      v-if="finished"
      class="flex flex-col justify-center items-center h-full"
    >
      <h2>You answered {{ amount }} questions in {{ elapsed }} seconds</h2>
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
        "
        @click="resetTest"
      >
        Start over
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SelectButton from "primevue/selectbutton";
import InputNumber from "primevue/inputnumber";

export default defineComponent({
  name: "Tester",
  components: {
    SelectButton,
    InputNumber,
  },
  data() {
    return {
      // To measure time from test start
      startTime: new Date(),
      // Seconds elapsed
      elapsed: 0,
      // Questions answered so far
      answered: 0,
      // Track the timer and stop it once done
      interval: -1,
      // Self explanatory
      started: false,
      finished: false,
      // To store the current question
      question: "",
      // Self explanatory
      answer: null as unknown as number,
      modelAnswer: null as unknown as number,
      // Set the highest number to generate
      difficulty: 10,
      difficulties: [
        {
          difficulty: 10,
          text: "Single digit numbers",
        },
        {
          difficulty: 100,
          text: "Double digit numbers",
        },
        {
          difficulty: 1000,
          text: "Triple digit numbers",
        },
      ],
      // Select which types to generate
      option: ["Addition", "Substraction"],
      options: ["Addition", "Substraction", "Multiplication", "Division"],
      // How many to generate
      amount: 10,
      amounts: [10, 20],
    };
  },
  watch: {},
  methods: {
    // Function parameter comes from https://primefaces.org/primevue/showcase/#/inputnumber
    checkAnswer(event: { originalEvent: KeyboardEvent; value: number }): void {
      // Check here if answer matches intended answer
      if (event.value == this.modelAnswer) {
        // Make answer field empty
        // @ts-expect-error Calling unsupported methods
        event.originalEvent.target.value = "";
        this.answered += 1;
        // Generate new question
        this.generateQuestion();
      }
    },
    generateQuestion(): void {
      // If done, go to the end
      if (this.answered == this.amount) {
        this.finished = true;
        // Stop timer
        clearInterval(this.interval);
      }
      // Pick random question type (could be improved)
      const type = this.option[Math.floor(Math.random() * this.option.length)];
      switch (type) {
        case "Addition":
          this.generateAddition();
          break;
        case "Substraction":
          this.generateSubstraction();
          break;
        case "Multiplication":
          this.generateMultiplication();
          break;
        case "Division":
          this.generateDivision();
          break;
      }
    },
    generateAddition(): void {
      const limit = this.difficulty;
      let int1 = 0;
      let int2 = 0;
      while (int1 == 0) {
        int1 = Math.floor(Math.random() * limit);
      }
      while (int2 == 0) {
        int2 = Math.floor(Math.random() * limit);
      }
      this.question = `${int1} + ${int2}`;
      this.modelAnswer = int1 + int2;
    },
    generateSubstraction(): void {
      const limit = this.difficulty;
      let int1 = 0;
      let int2 = 0;
      while (int1 == 0) {
        int1 = Math.floor(Math.random() * limit);
      }
      while (int2 == 0 || int2 == int1) {
        // We dont want int1 == int2
        int2 = Math.floor(Math.random() * limit);
      }
      this.question = `${int1} - ${int2}`;
      this.modelAnswer = int1 - int2;
    },
    generateMultiplication(): void {
      const limit = this.difficulty;
      let int1 = 0;
      let int2 = 0;
      // No multiplications by 1
      while (int1 == 0 || int1 == 1) {
        int1 = Math.floor(Math.random() * limit);
      }
      while (int2 == 0 || int2 == 1) {
        int2 = Math.floor(Math.random() * limit);
      }
      this.question = `${int1} x ${int2}`;
      this.modelAnswer = int1 * int2;
    },
    generateDivision(): void {
      const limit = this.difficulty;
      let int1 = 0;
      let int2 = 0;
      while (int1 == 0 || int1 == 1) {
        int1 = Math.floor(Math.random() * limit);
      }
      while (int2 == 0 || int2 == int1) {
        int2 = Math.floor(Math.random() * limit);
      }
      this.question = `${int1 * int2} / ${int2}`;
      this.modelAnswer = int1;
    },
    startTest(): void {
      if (this.difficulty == null || this.option == null) {
        return;
      }
      // Initialise these parameters
      this.started = true;
      this.elapsed = 0;
      this.answered = 0;
      this.startTime = new Date();
      // Start timer and set first question
      this.interval = setInterval(this.updateTimer, 1000);
      this.generateQuestion();
    },
    resetTest(): void {
      this.finished = false;
      this.started = false;
    },
    // Recalculate second difference since start
    updateTimer(): void {
      this.elapsed = Math.floor(
        (Math.round(new Date().valueOf()) -
          Math.round(this.startTime.valueOf())) /
          1000
      );
    },
  },
});
</script>

<style>
</style>
