import java.net.*;

class UDPClient {
    public static void main(String[] args) throws Exception {

        DatagramSocket ds = new DatagramSocket();

        byte[] b = "Hello From Client".getBytes();

        DatagramPacket dp = new DatagramPacket(
            b, b.length,
            InetAddress.getLocalHost(), 5000);

        ds.send(dp);

        b = new byte[1024];
        dp = new DatagramPacket(b, b.length);

        ds.receive(dp);

        System.out.println("Server: " +
            new String(dp.getData(), 0, dp.getLength()));

        ds.close();
    }
}