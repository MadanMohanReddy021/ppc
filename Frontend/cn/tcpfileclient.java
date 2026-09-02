import java.net.*;
import java.io.*;
import java.util.*;

class TCPFileClient {
    public static void main(String[] args) throws Exception {

        Socket s = new Socket("localhost", 5005);

        ObjectOutputStream oos =
            new ObjectOutputStream(s.getOutputStream());

        ObjectInputStream ois =
            new ObjectInputStream(s.getInputStream());

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter file name: ");
        String fileName = sc.nextLine();

        oos.writeObject(fileName);

        byte[] b = new byte[4096];
        int n;

        FileOutputStream fos =
            new FileOutputStream("received_" + fileName);

        while ((n = ois.read(b)) != -1)
            fos.write(b, 0, n);

        fos.close();
        oos.close();
        ois.close();
        s.close();

        System.out.println("File received.");
    }
}