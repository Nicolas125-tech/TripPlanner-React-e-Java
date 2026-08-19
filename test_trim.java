public class test_trim {
    public static void main(String[] args) {
        String city = "Paris";
        String query = " Paris ";
        System.out.println(city.toLowerCase().startsWith(query.toLowerCase()));
        System.out.println(city.toLowerCase().startsWith(query.trim().toLowerCase()));
    }
}
