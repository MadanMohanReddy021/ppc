import java.net.*;

class UDPServer {
    public static void main(String[] args) throws Exception {

        DatagramSocket ds = new DatagramSocket(5000);

        byte[] b = new byte[1024];
        DatagramPacket dp = new DatagramPacket(b, b.length);

        ds.receive(dp);

        System.out.println("Client: " +
            new String(dp.getData(), 0, dp.getLength()));

        String msg = "Hello From Server";
        b = msg.getBytes();

        dp = new DatagramPacket(
            b, b.length,
            dp.getAddress(), dp.getPort());

        ds.send(dp);
        ds.close();
    }
}
