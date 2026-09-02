import java.io.*;
import java.net.*;

class ClientThread extends Thread {

    DatagramSocket server;
    DatagramPacket clientPacket;

    ClientThread(DatagramSocket server, DatagramPacket clientPacket) {
        this.server = server;
        this.clientPacket = clientPacket;
    }

    public void run() {
        try {
            String fileName = new String(
                clientPacket.getData(),
                0,
                clientPacket.getLength()
            );

            File file = new File(fileName);

            if (!file.exists()) {
                byte[] message = "File Not Found".getBytes();

                DatagramPacket packet = new DatagramPacket(
                    message,
                    message.length,
                    clientPacket.getAddress(),
                    clientPacket.getPort()
                );

                server.send(packet);
                return;
            }

            FileInputStream fileInput = new FileInputStream(file);
            byte[] buffer = new byte[4096];
            int bytesRead;

            while ((bytesRead = fileInput.read(buffer)) != -1) {
                DatagramPacket packet = new DatagramPacket(
                    buffer,
                    bytesRead,
                    clientPacket.getAddress(),
                    clientPacket.getPort()
                );

                server.send(packet);
            }

            fileInput.close();

            System.out.println("File Sent Successfully");

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}

public class Exp4b_Server {

    public static void main(String args[]) throws Exception {

        DatagramSocket server = new DatagramSocket(59);

        System.out.println("Server Started...");

        while (true) {

            byte[] buffer = new byte[100];

            DatagramPacket clientPacket =
                new DatagramPacket(buffer, buffer.length);

            server.receive(clientPacket);

            System.out.println("Client Connected");

            ClientThread thread =
                new ClientThread(server, clientPacket);

            thread.start();
        }
    }
}