# chattyBot - GOV.UK GIFT Week experiment 2024

**Archived**

## Getting Started

To get started, follow the below steps:

1. Create an `.env` file by copying the `SAMPLE_env` file and add the model store provider you'll be using (e.g. `HUGGING_FACE` or `OPEN_AI`) and the API keys for the models you are going to use
1. Install packages
1. Run the backend server that will start with a default port of `3100`

    ```bash
        yarn start-server
    ```

1. Run the frontend server that will start with a default port of `5173`.

     ```bash
        yarn start
    ```

    _Note:_ You can use the `-p` flag to specify a port for the frontend server. To do this, you can either run `yarn start` with an additional flag, like so:

    ```bash
        yarn start -- --port 3000
    ```

    Or, edit the `start` script directly:

    ```bash
    vite --port 3000
    ```

Additional scripts are provided to prepare the app for production

- `yarn build` — This will output a production build of the frontend app in the `dist` directory.
- `yarn preview` — This will run the production build of the frontend app locally with a default port of `5173` (_note_: this will not work if you haven't generated the production build yet).

# Licence

[MIT License](LICENCE)
