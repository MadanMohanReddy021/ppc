import java.net.*;
import java.io.*;

class TCPClient {
    public static void main(String[] args) throws Exception {

        Socket s = new Socket("localhost", 5000);

        ObjectOutputStream oos =
            new ObjectOutputStream(s.getOutputStream());

        ObjectInputStream ois =
            new ObjectInputStream(s.getInputStream());

        oos.writeObject("Hello From Client");

        System.out.println("Server: " + ois.readObject());

        oos.close();
        ois.close();
        s.close();
    }
}