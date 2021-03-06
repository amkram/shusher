#include <atomic>
#include <cstdio>
#include <sys/mman.h>
//See whether a valus appeared twice
class Twice_Bloom_Filter {
    uint16_t* filter;
    int hash(int pos) {
        //This works for coronavirus whose length is 29903<32767, it basically does nothing
        return pos&0x7FFF;
    }
  public:
    Twice_Bloom_Filter() {
        filter=(uint16_t*) mmap(0,4096*2,PROT_READ|PROT_WRITE,MAP_SHARED | MAP_ANONYMOUS,-1,0);
        //perror("");
    }
    ~Twice_Bloom_Filter() {
        munmap(filter, 4096);
    }
    void insert(int pos) {
        int hash_code=hash(pos);
        //MSB is twice mask, LSB is once mask
        uint16_t* value_ptr=filter+(hash_code>>3);
        uint16_t value=*value_ptr;

        uint16_t once_mask=1<<(hash_code&7);
        //select the hit once bit, and move up to become hit twice mask, so hit twice will be set only if hit once is set
        uint16_t mark_twice_mask=((once_mask&value)<<8);

        *value_ptr=value|once_mask|mark_twice_mask;
    }

    bool query(int pos) {
        int hash_code=hash(pos);
        uint16_t value=filter[hash_code>>3];
        return value&(1<<((hash_code&7)+8));
    }
};