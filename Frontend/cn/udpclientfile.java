import java.net.*;

public class Exp4b_Client {

    public static void main(String args[]) throws Exception {

        DatagramSocket client = new DatagramSocket();

        InetAddress ip = InetAddress.getLocalHost();

        String fileName = "test.txt";

        byte[] buffer = fileName.getBytes();

        DatagramPacket packet = new DatagramPacket(
            buffer, buffer.length, ip, 59
        );

        client.send(packet);

        while (true) {

            buffer = new byte[4096];

            packet = new DatagramPacket(buffer, buffer.length);

            client.receive(packet);

            String msg = new String(
                packet.getData(),
                0,
                packet.getLength()
            );

            if (msg.equals("File Not Found")) {
                System.out.println(msg);
                break;
            }

            System.out.print(msg);

            if (packet.getLength() < 4096)
                break;
        }

        client.close();

        System.out.println("\nFile Received Successfully");
    }
}