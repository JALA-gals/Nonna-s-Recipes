## Inspiration
Food encompasses all aspects of human culture. But so many family recipes are never written down. Passed down by tradition, shared over practice, and passed down casually. When a recipe inevitably dies with no inheritances, not only are they lost to time, but they also lose the stories behind them. Whether you lost family, culturally adopted, or someone who felt disconnected from their community and family, many can relate to the plight of losing a part of their identity when a food they love disappears. 

## What it does
Nonna's Recipe is an ancestry-based cooking app that preserves family recipes in an easy, frictionless way. Nonna's Recipe features an easy recipe creation system that will connect your memories of a recipe with other family recipes in order to fill gaps. Instead of haggling your grandma to write down a recipe, simply ask a few questions or send in an audio recording of your memories, and our software will help you create a formal recipe to test and verify.

Nonna's Recipe also connects your food with other families' foods around the world. See the similarities or differences between your recipes and those around the world.  You can also explore the world as well, discovering the recipes of families across the world.

## How we built it
We developed a mobile app using React Native with Expo for cross-platform accessibility. For authentication, we implemented Firebase Authentication and built our structured database using Firestore.

Our AI functionality leverages the Gemini API for recipe creation and WhisprAPI for audio transcription, enabling users to speak their memories aloud and have them automatically captured. The product design and user experience were prototyped and iterated using Figma, ensuring the app is intuitive for users of all ages.

## Challenges we ran into
Our project consisted of a complete full-stack integrated software that had many difficult connections between the backend and the frontend. 

## Accomplishments that we're proud of
Building Nonna's Recipe as a fully integrated full-stack application presented multiple challenges. Synchronizing real-time data between Firestore and the app interface required careful planning to avoid inconsistencies. Accurately interpreting users’ memories, whether typed or submitted via audio, and converting them into formal, testable recipes pushed the limits of AI integration. Creating a simple-to-use tool well-suited for all ages that could have an emotionally meaningful and functional purpose, along with building an interactive map feature that visually connects food to heritage.

## What we learned
Through this project, we learned that effective full-stack development requires careful coordination between frontend, backend, and external services. We gained hands-on experience building a cross-platform mobile app with React Native Expo, managing authentication and real-time data with Firebase Authentication and Firestore, and integrating dynamic content generation for recipes. We also implemented WhisprAPI for audio input, learning how to process and structure user-submitted recordings into usable data for the app.

## What's next for Nonna's Recipes
We plan to enhance user accessibility by implementing features such as screen reader support, adjustable text sizes, and simplified navigation to ensure the app is usable by all members of the community. Additionally, we aim to incorporate food ancestry tracking,  giving you the ability to trace the ancestry of your food.

## How to run our Software

How to run, clone GitHub repo. CD into the frontend folder. Then:
run [npm install], then run [npx expo start], instructions will appear to help guide you in running the app on your phone through the Expo app.
