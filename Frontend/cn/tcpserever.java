import java.net.*;
import java.io.*;

class TCPServer {
    public static void main(String[] args) throws Exception {

        ServerSocket ss = new ServerSocket(5000);
        Socket s = ss.accept();

        ObjectInputStream ois =
            new ObjectInputStream(s.getInputStream());

        ObjectOutputStream oos =
            new ObjectOutputStream(s.getOutputStream());

        System.out.println("Client: " + ois.readObject());

        oos.writeObject("Hello From Server");

        oos.close();
        ois.close();
        s.close();
        ss.close();
    }
}