// Note: Replace *<YOUR_APPLICATION_TOKEN>* with your actual Application token

import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts"; 


async function getData(){
            
        
            // Initialize the client
            const client = new DataAPIClient(process.env.DB);
            const db = client.db('https://6696a652-7beb-46eb-8c08-496987121cac-us-east-2.apps.astra.datastax.com', { keyspace: "default_keyspace" });

            const colls = await db.listCollections();
            console.log('Connected to AstraDB:', colls);


            const table = db.collection('post_2048');

            // Fetch all rows
            const rows = await table.find().toArray();

           // console.log('Fetched Data from Table:', rows);
            
            return datagroupBy(rows);
            
                // const result = await db.execute(`
                //   SELECT Type, AVG(Likes) AS avg_likes, AVG(Shares) AS avg_shares, AVG(Comments) AS avg_comments
                //   FROM post_2048
                //   GROUP BY Type;
                // `);

                // console.log('Aggregated Data:', result.rows);
            
           
}
function datagroupBy(data) {
    console.log('Data length'  , data.length);
    let groupedData = {
    };
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        const type = data[i].post_type.toLowerCase();
        
        if (!groupedData[type]) {
          groupedData[type] = { total_likes:0 , total_comments:0 , total_shares:0,avg_likes: 0, avg_shares: 0, avg_comments: 0, count: 0 };
        }
      
        const likes = parseInt(data[i].likes, 10);
        const shares = parseInt(data[i].shares, 10);
        const comments = parseInt(data[i].comments, 10);
      
        groupedData[type].total_likes += likes;
        groupedData[type].total_shares += shares;
        groupedData[type].total_comments += comments;
        groupedData[type].count += 1;
      }
      Object.keys(groupedData).forEach((key) => {
        const group = groupedData[key];
        
        if (group.count > 0) { // Ensure count is not zero to avoid division by zero
          group.avg_likes = group.total_likes / group.count;
          group.avg_shares = group.total_shares / group.count;
          group.avg_comments = group.total_comments / group.count;
        }
      });
      
    console.log('Grouped Data:', groupedData);
    return groupedData;
}



class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }
    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

//Give me the best post performing post type

export async function POST(req) {
    // await sleep(5000);
//     return NextResponse.json({
//         success: true,
//         message: `The best-performing post type is **Reels**, and here’s why:\n
// •Reels outperform with **1.3x more likes** than carousels and **25% more likes** than static images, demonstrating higher user interest. \n
// •Reels generate **1.3x more comments** than static images and **1.5x more comments** than carousels, indicating greater engagement.\n
// •Reels maintain a balanced engagement, achieving **1.03x more shares** than carousels while being only **5% behind static images** in total shares.\n
// •Reels are the most engaging post type across multiple metrics, making them the top choice for maximizing interaction.`,
//     });
    try {
        let  inputValue  = (await req.json()).inputValue;
        let dbData  = JSON.stringify(await getData());
        //console.log("DB Data:", dbData);
        inputValue = dbData + " " +  inputValue;
        //console.log("Input Value:", inputValue);
        // inputType +=stringify(await req.json());

        const flowIdOrName = process.env.FLOWID;
        const langflowId = process.env.LANGFLOWID;
        const applicationToken = process.env.TOKEN;
        const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com',
            applicationToken);


        const inputType = 'chat'
        const outputType = 'chat'
        const stream = false
        const tweaks = {
            "ChatInput-pAup1": {},
            "ChatOutput-mydDO": {},
            "GoogleGenerativeAIModel-98icO": {},
            "Prompt-ceETP": {}
        };
        let response;
        response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            inputValue,
            inputType,
            outputType,
            tweaks,
            stream,
            (data) => console.log("Received:", data.chunk), // onUpdate
            (message) => console.log("Stream Closed:", message), // onClose
            (error) => console.log("Stream Error:", error) // onError
        );
        if (!stream && response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            console.log("Final Output:", output.message.text);
            return NextResponse.json({
                success: true,
                message: output.message.text,
            })
        }
        // main(
        //     inputValue, // inputValue
        //     args[1], // inputType
        //     args[2], // outputType
        //     args[3] === 'true' // stream
        // );


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        })
    }

}




// async function main(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {


// }

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Please run the file with the message as an argument: node <YOUR_FILE_NAME>.js "user_message"');
}
