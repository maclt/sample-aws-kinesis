import { KinesisClient, PutRecordsCommand, PutRecordsRequestEntry } from "@aws-sdk/client-kinesis";
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

const client = new KinesisClient({ 
  region: "ap-northeast-1",
}); 

const streamName = "Fill your stream name";

// Read and parse CSV file
const readEventsFromCSV = (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value: string, context: any) => {
      if (value === '') return null;
      if (context.column === 'Price' && value !== null) {
        return parseFloat(value);
      }
      if (context.column === 'Timestamp') {
        context.column = 'CreatedAt';
      }
      return value;
    }
  });
  return records;
};

const events = readEventsFromCSV('./sample-data/user-activities/2025-01-31.csv');

const putRecords = async () => {
  try {
    const records: PutRecordsRequestEntry[] = events.map((event: any) => ({
      PartitionKey: event.UserID,
      Data: new TextEncoder().encode(JSON.stringify(event)),
    }));

    const command = new PutRecordsCommand({
      StreamName: streamName,
      Records: records
    });

    const response = await client.send(command);
    console.log("PutRecords Response:", response);
  } catch (error) {
    console.error("Error sending records to Kinesis:", error);
  }
};

putRecords();
