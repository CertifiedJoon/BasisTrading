import signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5177/basis")
  .build();

async function start() {
  try {
    await connection.start();
    console.log("SignalR Connected.");
    connection.stream("SendBasisData", 500).subscribe({
      next: (item) => {
        console.log(item);
      },
      complete: () => {
        console.log("Stream finished");
      },
      error: (err) => {
        console.log(err);
      },
    });
  } catch (err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

connection.onclose(async () => {
  await start();
});

// Start the connection.
start();
