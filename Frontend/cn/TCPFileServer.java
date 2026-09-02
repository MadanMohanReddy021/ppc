import java.net.*;
import java.io.*;

class TCPFileServer {
    public static void main(String[] args) throws Exception {

        ServerSocket ss = new ServerSocket(5005);
        Socket s = ss.accept();

        ObjectInputStream ois =
            new ObjectInputStream(s.getInputStream());

        ObjectOutputStream oos =
            new ObjectOutputStream(s.getOutputStream());

        String fileName = (String) ois.readObject();

        File file = new File(fileName);

        if (file.exists()) {
            FileInputStream fis = new FileInputStream(file);

            byte[] b = new byte[4096];
            int n;

            while ((n = fis.read(b)) != -1)
                oos.write(b, 0, n);

            fis.close();
        } else {
            oos.writeObject("File Not Found");
        }

        oos.close();
        ois.close();
        s.close();
        ss.close();
    }
}