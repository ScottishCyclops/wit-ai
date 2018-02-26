const request = require("request")

/**
 * Tests if a Wit response is an error
 * @param {{error: string, code: string}} res the parsed api response
 */
const isError = res => res.error !== undefined && res.code !== undefined

/**
 * Returns the meaning extracted from an audio file
 * @param {string} token Wit token
 * @param {Buffer} bin Binary wav audio data
 * @param {{reference_time: string, timezone: string, locale: string}} context Context
 * @param {string} msg_id A specific Id you want to assign to the message that will be processed
 * @param {string} thread_id A specific Id that will let you group requests per conversation
 * @param {number} n The number of n-best trait entities you want to get back
 * @return {Promise<{}>}
 */
const speech = (token, bin, context, msg_id, thread_id, n) =>
(
    new Promise((resolve, reject) =>
    {
        const options = {
            url: "https://api.wit.ai/speech",
            method: "POST",
            headers: {
                "Content-Type": "audio/wav",
                "Authorization": "Bearer " + token,
                "Accept": "application/json",
            },
            qs: {
                context,
                msg_id,
                n,
            },
            body: bin
        }

        const handler = (error, res, body) =>
        {
                if(error) return reject(error)

                const response = JSON.parse(body)

                if(isError(response)) return reject(new Error(`${response.code}: ${response.error}`))

                return resolve(response)
        }

        request(options, handler)
    })
)

/**
 * Returns the meaning extracted from an audio stream
 * @param {string} token Wit token
 * @param {NodeJS.ReadableStream} stream stream of audio data
 * @param {{reference_time: string, timezone: string, locale: string}} context Context
 * @param {string} msg_id A specific Id you want to assign to the message that will be processed
 * @param {string} thread_id A specific Id that will let you group requests per conversation
 * @param {number} n The number of n-best trait entities you want to get back
 * @return {Promise<{}>}
 */
const stream = (token, stream, context, msg_id, thread_id, n) =>
(
    new Promise((resolve, reject) =>
    {
        const options = {
            url: "https://api.wit.ai/speech",
            method: "POST",
            headers: {
                "Content-Type": "audio/wav",
                "Transfer-encoding": "chunked",
                "Authorization": "Bearer " + token,
                "Accept": "application/json",
            },
            qs: {
                context,
                msg_id,
                n,
            },
            body: stream
        }

        const handler = (error, res, body) =>
        {
                if(error) return reject(error)

                const response = JSON.parse(body)

                if(isError(response)) return reject(new Error(`${response.code}: ${response.error}`))

                return resolve(response)
        }

        request(options, handler)
    })
)

/**
 * Returns the extracted meaning from a sentence, based on the app data
 * @param {string} token Wit token
 * @param {string} q User’s query. Length must be > 0 and < 256
 * @param {{reference_time: string, timezone: string, locale: string}} context Context
 * @param {string} msg_id A specific Id you want to assign to the message that will be processed
 * @param {string} thread_id A specific Id that will let you group requests per conversation
 * @param {number} n The number of n-best trait entities you want to get back
 * @param {boolean} verbose A flag to get auxiliary information about entities
 * @return {Promise<{msg_id: string, _text: string, entities: {}}>}
 */
const text = (token, q, context, msg_id, thread_id, n, verbose) =>
(
    new Promise((resolve, reject) =>
    {
        const options = {
            url: "https://api.wit.ai/message",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json",
            },
            qs: {
                q,
                context,
                msg_id,
                n,
                verbose,
            }
        }

        const handler = (error, res, body) =>
        {
                if(error) return reject(error)

                const response = JSON.parse(body)

                if(isError(response)) return reject(new Error(`${response.code}: ${response.error}`))

                return resolve(response)
        }

        request(options, handler)
    })
)

module.exports = {
    speech,
    stream,
    text,
}
