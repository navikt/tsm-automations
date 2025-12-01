import { raise } from './common/utils.ts'
import { postBlocks } from './common/slack.ts'

const image = Bun.argv.find((it) => it.startsWith('--image='))?.split('=')[1] ?? raise('Missing --image=<image> flag')
const type = image.includes
    ? image.includes('java21')
        ? 'java21'
        : image.includes('nodejs24')
          ? 'node24'
          : raise('Unknown distroless image type')
    : raise('Unknown distroless image type')

await postSlackUpdate(image)

process.exit(0)

function postSlackUpdate(image: string): Promise<void> {
    return postBlocks([
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: `Husk å sjekk om det er ny distroless digest ute for ${image}!`,
                emoji: true,
            },
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Kjør \`tsm repos --update-distroless=${type}\` for å se etter nye versjoner. Husk begge namespaces!`,
            },
        },
    ])
}
